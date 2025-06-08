package micro.mentalhealth.project.service;

import jakarta.transaction.Transactional;
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

import java.time.LocalDateTime;
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
                "http://therapist-service/api/therapeutes/" + therapistId + "/prix", Float.class);
        if (prixParHeure == null) throw new RuntimeException("Prix non disponible");
        return prixParHeure * (dureeMinutes / 60.0f);
    }

    // -------------- Check therapist availability -------------
    public boolean isTherapistAvailable(UUID therapistId, LocalDateTime dateTime, int dureeMinutes) {
        List<Seance> seances = seanceRepository.findByTherapeuteId(therapistId);
        LocalDateTime requestedEnd = dateTime.plusMinutes(dureeMinutes);

        for (Seance s : seances) {
            LocalDateTime start = s.getDateHeure();
            LocalDateTime end = start.plusMinutes(s.getDureeMinutes());
            if (dateTime.isBefore(end) && requestedEnd.isAfter(start)) {
                return false;
            }
        }
        return true;
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

    static class CreatePaymentRequest {
        private UUID patientId;
        private UUID therapistId;
        private UUID seanceId;
        private float amount;
        private String paymentMethod;

        public CreatePaymentRequest(UUID patientId, UUID therapistId, UUID seanceId, float amount, String paymentMethod) {
            this.patientId = patientId;
            this.therapistId = therapistId;
            this.seanceId = seanceId;
            this.amount = amount;
            this.paymentMethod = paymentMethod;
        }

        public UUID getPatientId() { return patientId; }
        public void setPatientId(UUID patientId) { this.patientId = patientId; }

        public UUID getTherapistId() { return therapistId; }
        public void setTherapistId(UUID therapistId) { this.therapistId = therapistId; }

        public UUID getSeanceId() { return seanceId; }
        public void setSeanceId(UUID seanceId) { this.seanceId = seanceId; }

        public float getAmount() { return amount; }
        public void setAmount(float amount) { this.amount = amount; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

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
