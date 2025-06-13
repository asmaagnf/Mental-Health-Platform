package micro.mentalhealth.project.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeRangeDto {
    @NotNull(message = "Start time cannot be null")
    private LocalTime heureDebut;

    @NotNull(message = "End time cannot be null")
    private LocalTime heureFin;
}
