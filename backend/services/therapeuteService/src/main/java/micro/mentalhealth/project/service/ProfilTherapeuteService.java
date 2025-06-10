package micro.mentalhealth.project.service;

import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.ProfilTherapeuteDTO;
import micro.mentalhealth.project.mapper.ProfilTherapeuteMapper;
import micro.mentalhealth.project.model.Certification;
import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.StatutTherapeute;
import micro.mentalhealth.project.repository.ProfilTherapeuteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProfilTherapeuteService {

    private final ProfilTherapeuteRepository repository;

    public ProfilTherapeuteDTO createProfil(ProfilTherapeuteDTO dto) {
        ProfilTherapeute profil = ProfilTherapeuteMapper.toEntity(dto);
        profil.setId(UUID.randomUUID());
        profil.setCreatedAt(LocalDateTime.now());
        profil.setStatut(StatutTherapeute.EN_ATTENTE);

        ProfilTherapeute saved = repository.save(profil);
        return ProfilTherapeuteMapper.toDto(saved);
    }

    public ProfilTherapeuteDTO updateProfil(UUID id, ProfilTherapeuteDTO dto) {
        ProfilTherapeute profil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id));

        profil.setSpecialites(dto.getSpecialites());
        profil.setLanguesParlees(dto.getLanguesParlees());
        profil.setLocalisation(dto.getLocalisation());
        profil.setAnneesExperience(dto.getAnneesExperience());
        profil.setPrixParHeure(dto.getPrixParHeure());

        // Update certifications only if non-empty list provided
        if (dto.getCertificationsBase64() != null && !dto.getCertificationsBase64().isEmpty()) {
            List<Certification> decodedCerts = new ArrayList<>();
            for (String base64 : dto.getCertificationsBase64()) {
                byte[] fileBytes = Base64.getDecoder().decode(base64);
                decodedCerts.add(new Certification(fileBytes));
            }
            profil.setCertifications(decodedCerts);
        }

        ProfilTherapeute updated = repository.save(profil);
        return ProfilTherapeuteMapper.toDto(updated);
    }

    public ProfilTherapeuteDTO getById(UUID id) {
        return repository.findById(id)
                .map(ProfilTherapeuteMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id));
    }

    public void changerStatut(UUID id, StatutTherapeute nouveauStatut) {
        ProfilTherapeute profil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id));

        profil.setStatut(nouveauStatut);

        if (nouveauStatut == StatutTherapeute.VALIDE) {
            profil.setValidatedAt(LocalDateTime.now());
        }

        repository.save(profil);
    }

    public void updateLocalisation(UUID id, String adresse) {
        ProfilTherapeute profil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id));

        profil.setLocalisation(adresse);
        repository.save(profil);
    }

    public void addCertification(UUID id, MultipartFile file) throws IOException {
        ProfilTherapeute profil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image.");
        }

        List<Certification> certs = Optional.ofNullable(profil.getCertifications()).orElse(new ArrayList<>());
        certs.add(new Certification(file.getBytes()));
        profil.setCertifications(certs);

        repository.save(profil);
    }

    public List<ProfilTherapeuteDTO> getAllProfils() {
        return repository.findAll()
                .stream()
                .map(ProfilTherapeuteMapper::toDto)
                .toList();
    }

    public void deleteProfil(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Profil thérapeute non trouvé avec l'ID : " + id);
        }
        repository.deleteById(id);
    }

    public List<ProfilTherapeuteDTO> getByStatut(StatutTherapeute statut) {
        return repository.findAllByStatut(statut)
                .stream()
                .map(ProfilTherapeuteMapper::toDto)
                .toList();
    }
}
