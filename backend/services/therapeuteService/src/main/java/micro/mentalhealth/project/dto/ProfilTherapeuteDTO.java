package micro.mentalhealth.project.dto;

import lombok.*;
import micro.mentalhealth.project.model.StatutTherapeute;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProfilTherapeuteDTO {
    private UUID id;
    private UUID utilisateurId;
    private List<String> specialites;
    private List<String> languesParlees;
    private String localisation;
    private List<String> certificationsBase64;
    private int anneesExperience;
    private StatutTherapeute statut;
    private float prixParHeure;
    private LocalDateTime createdAt;
    private LocalDateTime validatedAt;
}
