package micro.mentalhealth.project.dto.symptom;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymptomRequest {
    @NotBlank(message = "Le nom du symptôme ne peut pas être vide")
    private String nom;
}
