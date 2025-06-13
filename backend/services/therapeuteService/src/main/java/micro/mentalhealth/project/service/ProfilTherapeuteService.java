package micro.mentalhealth.project.service;

import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import micro.mentalhealth.project.model.events.TherapistProfileCreatedEvent;
import micro.mentalhealth.project.model.events.TherapistProfileUpdatedEvent;
import micro.mentalhealth.project.model.events.TherapistValidatedEvent;
import micro.mentalhealth.project.model.events.TherapistRejectedEvent;
import micro.mentalhealth.project.repository.ProfilTherapeuteRepository;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteRequest;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteResponse;
import micro.mentalhealth.project.mapper.ProfilTherapeuteMapper;
import micro.mentalhealth.project.mapper.DiplomaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfilTherapeuteService {

    private final ProfilTherapeuteRepository profilTherapeuteRepository;
    private final ProfilTherapeuteMapper profilTherapeuteMapper;
    private final DiplomaMapper DiplomaMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final String UPLOAD_DIR = "C:/Users/HP/Desktop/mental-health-platform/backend/services/therapeuteService/uploads/";

    @Autowired
    public ProfilTherapeuteService(ProfilTherapeuteRepository profilTherapeuteRepository,
                                   ProfilTherapeuteMapper profilTherapeuteMapper,
                                   DiplomaMapper DiplomaMapper,
                                   ApplicationEventPublisher eventPublisher) {
        this.profilTherapeuteRepository = profilTherapeuteRepository;
        this.profilTherapeuteMapper = profilTherapeuteMapper;
        this.DiplomaMapper = DiplomaMapper;
        this.eventPublisher = eventPublisher;
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }


    @Transactional

    public ProfilTherapeuteResponse createInitialProfil(UUID userId, ProfilTherapeuteRequest request) {
        if (profilTherapeuteRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Profile already exists for this user: " + userId);
        }

        ProfilTherapeute newProfil = new ProfilTherapeute();
        newProfil.setUserId(userId);
        newProfil.setSpecialites(request.getSpecialites());
        newProfil.setDescription(request.getDescription());
        newProfil.setAnneesExperience(request.getAnneesExperience());
        newProfil.setDiplomas(DiplomaMapper.toEntityList(request.getDiplomas()));
        newProfil.setLanguesParlees(request.getLanguesParlees());
        newProfil.setLocalisation(request.getLocalisation());
        newProfil.setAvailable(request.getAvailable());
        newProfil.setPrixParHeure(request.getPrixParHeure());
        newProfil.setStatutProfil(StatutProfil.EN_ATTENTE); // ✅ Important

        ProfilTherapeute savedProfil = profilTherapeuteRepository.save(newProfil);
        eventPublisher.publishEvent(new TherapistProfileCreatedEvent(userId));
        return profilTherapeuteMapper.toDto(savedProfil);
    }

    @Transactional
    public ProfilTherapeuteResponse updateProfil(UUID userId, ProfilTherapeuteRequest request) {
        ProfilTherapeute existingProfil = profilTherapeuteRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with userId: " + userId));

        // Use the mapper to apply updates from the request DTO to the existing entity.
        // The profilTherapeuteMapper's toEntity method is designed for this.
        // However, since you're updating an *existing* entity, you need to be careful.
        // Instead of creating a new entity, we'll update the existing one's fields.
        // We'll leverage the mapper's internal logic for complex nested objects like diplomas.

        ProfilTherapeute tempProfil = profilTherapeuteMapper.toEntity(request); // Map request to a temporary entity

        existingProfil.setSpecialites(tempProfil.getSpecialites());
        existingProfil.setDescription(tempProfil.getDescription());
        existingProfil.setAnneesExperience(tempProfil.getAnneesExperience());
        existingProfil.setDiplomas(tempProfil.getDiplomas()); // This will now correctly use the mapped diplomas from tempProfil
        existingProfil.setLanguesParlees(tempProfil.getLanguesParlees());
        existingProfil.setLocalisation(tempProfil.getLocalisation());
        existingProfil.setAvailable(tempProfil.getAvailable());
        existingProfil.setPrixParHeure(tempProfil.getPrixParHeure());

        // Keep status as EN_ATTENTE or current if already validated/rejected
        if (existingProfil.getStatutProfil() != StatutProfil.VALIDE && existingProfil.getStatutProfil() != StatutProfil.REJETE) {
            existingProfil.setStatutProfil(StatutProfil.EN_ATTENTE); // Ensures it goes to pending if not yet validated or already rejected
        }


        ProfilTherapeute updatedProfil = profilTherapeuteRepository.save(existingProfil);
        eventPublisher.publishEvent(new TherapistProfileUpdatedEvent(updatedProfil.getId()));
        return profilTherapeuteMapper.toDto(updatedProfil);
    }

    @Transactional
    public String uploadDiplomaImage(UUID userId, String diplomaTitle, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        // Save file as before
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path path = Paths.get(UPLOAD_DIR + uniqueFilename);
        Files.copy(file.getInputStream(), path);

        String imageUrl = "/uploads/" + uniqueFilename;

        // Now update the diploma imageUrl in the profile
        ProfilTherapeute profil = profilTherapeuteRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with userId: " + userId));

        // Find the diploma by title (or some unique identifier)
        profil.getDiplomas().stream()
                .filter(d -> d.getTitle().equalsIgnoreCase(diplomaTitle))
                .findFirst()
                .ifPresent(diploma -> diploma.setImageUrl(imageUrl));

        profilTherapeuteRepository.save(profil);

        return imageUrl;
    }
    @Transactional(readOnly = true)
    public List<ProfilTherapeuteResponse> getProfilsByStatutValide() {
        List<ProfilTherapeute> profils = profilTherapeuteRepository.findByStatutProfil(StatutProfil.VALIDE);
        return profils.stream()
                .map(profilTherapeuteMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Double getPrixParHeureByUserId(UUID userId) {
        return profilTherapeuteRepository.findByUserId(userId)
                .map(ProfilTherapeute::getPrixParHeure)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with userId: " + userId));
    }

    @Transactional(readOnly = true)
    public ProfilTherapeuteResponse getProfilByUserId(UUID userId) {
        ProfilTherapeute profil = profilTherapeuteRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with userId: " + userId));
        return profilTherapeuteMapper.toDto(profil);
    }

    @Transactional(readOnly = true)
    public ProfilTherapeuteResponse getProfilById(UUID profilId) {
        ProfilTherapeute profil = profilTherapeuteRepository.findById(profilId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with id: " + profilId));
        return profilTherapeuteMapper.toDto(profil);
    }

    @Transactional
    public ProfilTherapeuteResponse validateProfil(UUID profilId) {
        ProfilTherapeute profil = profilTherapeuteRepository.findById(profilId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with id: " + profilId));

        if (profil.getStatutProfil() == StatutProfil.VALIDE) {
            throw new IllegalArgumentException("Therapist profile is already validated.");
        }

        profil.setStatutProfil(StatutProfil.VALIDE);
        ProfilTherapeute validatedProfil = profilTherapeuteRepository.save(profil);
        eventPublisher.publishEvent(new TherapistValidatedEvent(profil.getId()));
        return profilTherapeuteMapper.toDto(validatedProfil);
    }

    @Transactional(readOnly = true)
    public List<ProfilTherapeuteResponse> getAllProfils() {
        List<ProfilTherapeute> profils = profilTherapeuteRepository.findAll();
        return profils.stream()
                .map(profilTherapeuteMapper::toDto)
                .toList();
    }
    @Transactional
    public ProfilTherapeuteResponse rejectProfil(UUID profilId,  String reason) {
        ProfilTherapeute profil = profilTherapeuteRepository.findById(profilId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with id: " + profilId));

        if (profil.getStatutProfil() == StatutProfil.REJETE) {
            throw new IllegalArgumentException("Therapist profile is already rejected.");
        }

        profil.setStatutProfil(StatutProfil.REJETE);
        ProfilTherapeute rejectedProfil = profilTherapeuteRepository.save(profil);
        eventPublisher.publishEvent(new TherapistRejectedEvent(profil.getId(),  reason));
        return profilTherapeuteMapper.toDto(rejectedProfil);
    }
}
