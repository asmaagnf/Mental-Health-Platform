package micro.mentalhealth.project.dto.disponibilite;

import micro.mentalhealth.project.dto.common.TimeRangeDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisponibiliteRequest {
    @NotNull(message = "Day cannot be null")
    private DayOfWeek jour;

    @NotNull(message = "Time range cannot be null")
    @Valid
    private TimeRangeDto plageHoraire;
}
