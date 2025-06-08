package micro.mentalhealth.project.dto.mood;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import micro.mentalhealth.project.model.valueobjects.NiveauHumeur;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodEntryRequest {

    @NotNull(message = "Mood level cannot be null")
    private NiveauHumeur niveau;

    @Size(max = 500, message = "Note cannot exceed 500 characters")
    private String note;
}

