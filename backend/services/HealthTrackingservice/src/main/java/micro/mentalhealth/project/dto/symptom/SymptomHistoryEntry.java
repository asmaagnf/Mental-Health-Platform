package micro.mentalhealth.project.dto.symptom;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomHistoryEntry {
    private LocalDate date;
    private int intensite;
    private LocalDateTime timestamp;
}
