package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import micro.mentalhealth.project.model.valueobjects.IntensiteSymptome;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomeObservé {
    private UUID patientId;
    private String nomSymptome;
    private IntensiteSymptome intensite;
    private LocalDate date;
    private LocalDateTime timestamp;
}
