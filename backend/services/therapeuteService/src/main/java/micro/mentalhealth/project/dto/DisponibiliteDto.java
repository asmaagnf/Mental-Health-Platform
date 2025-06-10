package micro.mentalhealth.project.dto;

import lombok.*;
import micro.mentalhealth.project.model.JourDisponibilite;
import micro.mentalhealth.project.model.PlageHoraire;

import java.util.UUID;

@Data
@Builder
public class DisponibiliteDto {
    private UUID id;
    private UUID therapeuteId;
    private JourDisponibilite jour;
    private PlageHoraire plageHoraire;
}

