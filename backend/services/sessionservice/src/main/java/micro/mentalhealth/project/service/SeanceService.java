package micro.mentalhealth.project.service;

import jakarta.transaction.Transactional;
import micro.mentalhealth.project.dto.DisponibiliteDTO;
import micro.mentalhealth.project.dto.PlageHoraireDTO;
import micro.mentalhealth.project.dto.SeanceDTO;
import micro.mentalhealth.project.mapper.SeanceMapper;
import micro.mentalhealth.project.model.LienVisio;
import micro.mentalhealth.project.model.Seance;
import micro.mentalhealth.project.model.StatutSeance;
import micro.mentalhealth.project.model.TypeSeance;
import micro.mentalhealth.project.repository.SeanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SeanceService {
    @Autowired
    private SeanceRepository seanceRepository;
    @Autowired
    private SeanceMapper seanceMapper;
    @Autowired
    private RestTemplate restTemplate;

    public List<SeanceDTO> getAllSeances() {
        return seanceMapper.toDTOList(seanceRepository.findAll());
    }

    public Optional<SeanceDTO> getSeanceById(UUID id) {
        return seanceRepository.findById(id).map(seanceMapper::toDTO);
    }

    public List<SeanceDTO> getSeancesByTherapeuteId(UUID therapeuteId) {
        return seanceMapper.toDTOList(seanceRepository.findByTherapeuteId(therapeuteId));
    }

    public List<SeanceDTO> getSeancesByPatientId(UUID patientId) {
        return seanceMapper.toDTOList(seanceRepository.findByPatientId(patientId));
    }

    public SeanceDTO createSeance(SeanceDTO dto) {
        Seance seance = seanceMapper.toEntity(dto);
        return seanceMapper.toDTO(seanceRepository.save(seance));
    }

    public void deleteSeance(UUID id) {
        seanceRepository.deleteById(id);
    }

    public SeanceDTO updateSeance(UUID id, SeanceDTO dto) {
        Seance existing = seanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seance not found"));
        Seance updated = seanceMapper.toEntity(dto);
        updated.setSeanceId(existing.getSeanceId());
        return seanceMapper.toDTO(seanceRepository.save(updated));
    }

    public SeanceDTO ajouterNote(UUID seanceId, String note) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        if (LocalDateTime.now().isBefore(seance.getDateHeure())) {
            throw new RuntimeException("La séance n'a pas encore commencé");
        }

        seance.setNoteTherapeute(note);
        Seance updated = seanceRepository.save(seance);
        return seanceMapper.toDTO(updated);
    }


    // -------------- Price preview ----------------
    public float calculateAmount(UUID therapistId, int dureeMinutes) {
        Float prixParHeure = restTemplate.getForObject(
                "http://therapeute-service/api/therapeutes/profiles/" + therapistId + "/price", Float.class);
        if (prixParHeure == null) throw new RuntimeException("Prix non disponible");
        return prixParHeure * (dureeMinutes / 60.0f);
    }

    // -------------- Check therapist availability -------------
    public boolean isTherapistAvailable(UUID therapistId, LocalDateTime dateTime, int dureeMinutes) {
        // 1. Récupérer disponibilités du thérapeute via REST
        String url = "http://therapeute-service/api/therapeutes/" + therapistId + "/disponibilites";
        DisponibiliteDTO[] disponibilites = restTemplate.getForObject(url, DisponibiliteDTO[].class);

        if (disponibilites == null || disponibilites.length == 0) {
            return false; // Pas de disponibilités => pas dispo
        }

        DayOfWeek jourSeance = dateTime.getDayOfWeek();
        LocalTime heureDebutSeance = dateTime.toLocalTime();
        LocalTime heureFinSeance = heureDebutSeance.plusMinutes(dureeMinutes);

        // 2. Vérifier si la séance est dans une plage horaire dispo
        boolean dansPlage = false;
        for (DisponibiliteDTO dispo : disponibilites) {
            if (dispo.getJour().equals(jourSeance)) {
                PlageHoraireDTO plage = dispo.getPlageHoraire();
                LocalTime debutPlage = plage.getHeureDebut();
                LocalTime finPlage = plage.getHeureFin();

                if (!heureDebutSeance.isBefore(debutPlage) && !heureFinSeance.isAfter(finPlage)) {
                    dansPlage = true;
                    break;
                }
            }
        }
        if (!dansPlage) return false; // Pas dans les plages horaires du thérapeute

        // 3. Vérifier conflits avec les séances déjà planifiées du thérapeute
        LocalDateTime finSeance = dateTime.plusMinutes(dureeMinutes);
        List<Seance> seancesConflit = seanceRepository.findConflictingSeances(therapistId, dateTime, finSeance);

        // Si une séance existe et chevauche, le thérapeute n'est pas disponible
        if (!seancesConflit.isEmpty()) {
            return false;
        }

        return true; // Pas de conflit et dans plage dispo
    }
    public SeanceDTO createPendingSeance(UUID therapistId, UUID patientId, LocalDateTime dateTime, int dureeMinutes, TypeSeance typeSeance) {
        System.out.println("Checking therapist availability...");
        if (!isTherapistAvailable(therapistId, dateTime, dureeMinutes)) {
            System.out.println("Therapist not available");
            throw new RuntimeException("Therapist not available");
        }
        System.out.println("Creating new seance...");
        Seance seance = Seance.builder()
                .therapeuteId(therapistId)
                .patientId(patientId)
                .dateHeure(dateTime)
                .dureeMinutes(dureeMinutes)
                .typeSeance(typeSeance)
                .statutSeance(StatutSeance.EN_ATTENTE_PAIEMENT) // waiting payment
                .build();
        if (typeSeance == TypeSeance.EN_LIGNE) {
            seance.setLienVisio(new LienVisio("https://meet.jit.si/seance-" + seance.getSeanceId()));
        }
        System.out.println("Saving seance to repository...");
        Seance saved = seanceRepository.save(seance);
        System.out.println("Seance saved with id: " + saved.getSeanceId());
        return seanceMapper.toDTO(saved);
    }

    // -------------- Confirm booking after payment --------------
    @Transactional
    public SeanceDTO confirmSeanceAfterPayment(UUID seanceId, UUID paymentId) {
        // Retrieve the séance by ID, throw if not found
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance non trouvée"));

        // Validate payment status via payment microservice
        PaymentResponse response = null;
        try {
            response = getPaymentStatus(paymentId);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la vérification du paiement : " + e.getMessage());
        }

        if (response == null || !"REUSSI".equalsIgnoreCase(response.getPaymentStatus())) {
            throw new RuntimeException("Paiement échoué ou statut inconnu");
        }

        // Update séance status to confirmed
        seance.setStatutSeance(StatutSeance.PLANIFIEE);
        Seance updated = seanceRepository.save(seance);

        return seanceMapper.toDTO(updated);
    }

    public PaymentResponse getPaymentStatus(UUID paymentId) {
        String url = "http://payment-service/api/payments/" + paymentId;

        try {
            PaymentResponse response = restTemplate.getForObject(url, PaymentResponse.class);
            if (response == null) {
                throw new RuntimeException("Aucune réponse du service de paiement pour l'ID : " + paymentId);
            }
            return response;
        } catch (Exception ex) {
            throw new RuntimeException("Erreur lors de l'appel au service de paiement : " + ex.getMessage());
        }
    }

    public float getMontantFromPayment(UUID paymentId) {
        String url = "http://payment-service/api/payments/" + paymentId;
        try {
            PaymentResponse response = restTemplate.getForObject(url, PaymentResponse.class);
            if (response == null) {
                throw new RuntimeException("Paiement non trouvé pour ID : " + paymentId);
            }
            return response.getAmount();
        } catch (Exception ex) {
            throw new RuntimeException("Erreur lors de la récupération du montant du paiement : " + ex.getMessage());
        }
    }

    @Transactional
    public SeanceDTO annulerSeance(UUID seanceId, String motif) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));

        if (seance.getStatutSeance() != StatutSeance.PLANIFIEE) {
            throw new RuntimeException("Seule une séance planifiée peut être annulée");
        }

        // 1. Get the payment related to this seance
        UUID paymentId = getPaymentIdBySeanceId(seanceId);
        if (paymentId == null) {
            throw new RuntimeException("Paiement introuvable pour cette séance");
        }

        // 2. Get the montant from payment service
        float montant = getMontantFromPayment(paymentId);

        // 3. Cancel the seance locally
        seance.setStatutSeance(StatutSeance.ANNULEE);
        seanceRepository.save(seance);

        // 4. Create remboursement with montant included
        CreateRemboursementRequest remboursementRequest = new CreateRemboursementRequest(paymentId, motif, montant);
        ResponseEntity<RemboursementDTO> response = restTemplate.postForEntity(
                "http://payment-service/api/remboursements",
                remboursementRequest,
                RemboursementDTO.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Échec du remboursement");
        }

        return seanceMapper.toDTO(seance);
    }

    public UUID getPaymentIdBySeanceId(UUID seanceId) {
        String url = "http://payment-service/api/payments/byseance/" + seanceId;

        try {
            PaymentResponse response = restTemplate.getForObject(url, PaymentResponse.class);
            if (response == null) {
                return null;
            }
            return response.getId();
        } catch (Exception ex) {
            throw new RuntimeException("Erreur lors de la récupération du paiement : " + ex.getMessage());
        }
    }

    public SeanceDTO terminerSeance(UUID seanceId) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));

        if (seance.getStatutSeance() != StatutSeance.PLANIFIEE) {
            throw new RuntimeException("Seule une séance planifiée peut être terminée");
        }

        if (LocalDateTime.now().isBefore(seance.getDateHeure().plusMinutes(seance.getDureeMinutes()))) {
            throw new RuntimeException("La séance n’est pas encore terminée");
        }

        seance.setStatutSeance(StatutSeance.TERMINEE);
        return seanceMapper.toDTO(seanceRepository.save(seance));
    }

    // ---- Replaced Lombok by standard constructors and getters/setters ----



    static class PaymentResponse {
        private UUID id;
        private UUID seanceId;
        private String paymentStatus;
        private float amount;  // add montant here

        // getters and setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public UUID getSeanceId() { return seanceId; }
        public void setSeanceId(UUID seanceId) { this.seanceId = seanceId; }

        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

        public float getAmount() { return amount; }
        public void setAmount(float amount) { this.amount = amount; }
    }

    static class NotificationRequest {
        private UUID userId;
        private String message;

        public NotificationRequest(UUID userId, String message) {
            this.userId = userId;
            this.message = message;
        }

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    static class CreateRemboursementRequest {
        private UUID paiementId;
        private String motif;
        private float montant;

        public CreateRemboursementRequest(UUID paiementId, String motif,float montant) {
            this.paiementId = paiementId;
            this.motif = motif;
            this.montant = montant;
        }

        public UUID getPaiementId() { return paiementId; }
        public void setPaiementId(UUID paiementId) { this.paiementId = paiementId; }

        public String getMotif() { return motif; }
        public void setMotif(String motif) { this.motif = motif; }

        public float getMontant() { return montant; }
        public void setMontant(float montant) { this.montant = montant; }
    }

    static class RemboursementDTO {
        private UUID id;
        private UUID paiementId;
        private String motif;
        private String statut;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public UUID getPaiementId() { return paiementId; }
        public void setPaiementId(UUID paiementId) { this.paiementId = paiementId; }

        public String getMotif() { return motif; }
        public void setMotif(String motif) { this.motif = motif; }

        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }
}
