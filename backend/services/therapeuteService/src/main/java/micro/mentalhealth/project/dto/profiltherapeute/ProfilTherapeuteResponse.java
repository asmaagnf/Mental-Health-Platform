package micro.mentalhealth.project.dto.profiltherapeute;

import micro.mentalhealth.project.dto.common.DiplomaDto;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfilTherapeuteResponse {
    private UUID id;
    private UUID userId;
    private List<String> specialites;
    private String description;
    private Integer anneesExperience;
    private List<DiplomaDto> diplomas;
    private List<String> languesParlees;
    private String localisation;
    private Boolean available;
    private Double prixParHeure;
    private StatutProfil statutProfil;
}
