package micro.mentalhealth.project.dto.disponibilite;

import micro.mentalhealth.project.dto.common.TimeRangeDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisponibiliteResponse {
    private UUID id;
    private UUID therapeuteId;
    private DayOfWeek jour;
    private TimeRangeDto plageHoraire;
}
