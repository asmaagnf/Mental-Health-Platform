package micro.mentalhealth.project.dto.symptom;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomObservationRequest {
    @NotBlank(message = "Symptom name cannot be empty")
    @Size(max = 100, message = "Symptom name cannot exceed 100 characters")
    private String nomSymptome;

    @NotNull(message = "Intensity cannot be null")
    @Min(value = 1, message = "Intensity must be at least 1")
    @Max(value = 5, message = "Intensity cannot exceed 5")
    private int intensite;
}

