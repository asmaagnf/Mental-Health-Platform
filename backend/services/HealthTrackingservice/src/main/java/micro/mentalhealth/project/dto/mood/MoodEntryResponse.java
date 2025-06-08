package micro.mentalhealth.project.dto.mood;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import micro.mentalhealth.project.model.valueobjects.NiveauHumeur;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodEntryResponse {

    private LocalDate date;
    private NiveauHumeur niveau;
    private String note;
    private LocalDateTime timestamp;
    private UUID patientId;
}

