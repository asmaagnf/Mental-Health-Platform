package micro.mentalhealth.project.dto.profiltherapeute;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapeuteSearchRequest {
    private String specialty;
    private String localisation;
    private String langue;
    private Integer minExperience;
    private Double maxPricePerHour;
}
