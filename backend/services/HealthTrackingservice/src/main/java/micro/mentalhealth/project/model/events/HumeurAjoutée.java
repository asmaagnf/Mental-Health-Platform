package micro.mentalhealth.project.model.events;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import micro.mentalhealth.project.model.valueobjects.NiveauHumeur;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HumeurAjoutée {
    private UUID patientId;
    private LocalDate date;
    private NiveauHumeur niveau;
    private String note;
    private LocalDateTime timestamp;
}
