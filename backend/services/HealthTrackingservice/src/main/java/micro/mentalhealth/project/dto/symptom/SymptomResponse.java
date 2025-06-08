package micro.mentalhealth.project.dto.symptom;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomResponse {
    private String nom;
    private UUID patientId;
}
