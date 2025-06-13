package micro.mentalhealth.project.dto;

import java.time.DayOfWeek;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisponibiliteDTO {
    private UUID id;
    private UUID therapeuteId;
    private DayOfWeek jour; // ex: "MONDAY", "THURSDAY"
    private PlageHoraireDTO plageHoraire;

    // getters et setters
}
