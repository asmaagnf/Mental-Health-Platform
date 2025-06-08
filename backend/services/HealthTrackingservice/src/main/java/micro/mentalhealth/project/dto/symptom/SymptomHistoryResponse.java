package micro.mentalhealth.project.dto.symptom;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomHistoryResponse {
    private String nomSymptome;
    private UUID patientId;
    private List<SymptomHistoryEntry> history;
    private double trend;
}
