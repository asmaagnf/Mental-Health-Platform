package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.ProfilTherapeuteDTO;
import micro.mentalhealth.project.model.Certification;
import micro.mentalhealth.project.model.ProfilTherapeute;

import java.util.Base64;
import java.util.Collections;
import java.util.stream.Collectors;

public class ProfilTherapeuteMapper {

    public static ProfilTherapeuteDTO toDto(ProfilTherapeute profil) {
        return ProfilTherapeuteDTO.builder()
                .id(profil.getId())
                .utilisateurId(profil.getUtilisateurId())
                .specialites(profil.getSpecialites())
                .languesParlees(profil.getLanguesParlees())
                .localisation(profil.getLocalisation())
                .certificationsBase64(
                        profil.getCertifications() != null ?
                                profil.getCertifications().stream()
                                        .map(cert -> Base64.getEncoder().encodeToString(cert.getFile())) // note .getFile()
                                        .collect(Collectors.toList()) :
                                Collections.emptyList()
                )
                .anneesExperience(profil.getAnneesExperience())
                .statut(profil.getStatut())
                .prixParHeure(profil.getPrixParHeure())
                .createdAt(profil.getCreatedAt())
                .validatedAt(profil.getValidatedAt())
                .build();
    }

    public static ProfilTherapeute toEntity(ProfilTherapeuteDTO dto) {
        return ProfilTherapeute.builder()
                .id(dto.getId())
                .utilisateurId(dto.getUtilisateurId())
                .specialites(dto.getSpecialites())
                .languesParlees(dto.getLanguesParlees())
                .localisation(dto.getLocalisation())
                .certifications(
                        dto.getCertificationsBase64() != null ?
                                dto.getCertificationsBase64().stream()
                                        .map(base64 -> new Certification(Base64.getDecoder().decode(base64))) // map to Certification
                                        .collect(Collectors.toList()) :
                                Collections.emptyList())
                .anneesExperience(dto.getAnneesExperience())
                .statut(dto.getStatut())
                .prixParHeure(dto.getPrixParHeure())
                .createdAt(dto.getCreatedAt())
                .validatedAt(dto.getValidatedAt())
                .build();
    }
}
