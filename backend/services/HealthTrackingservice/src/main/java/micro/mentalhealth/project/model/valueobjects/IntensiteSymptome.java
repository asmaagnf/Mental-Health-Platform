package micro.mentalhealth.project.model.valueobjects;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Embeddable;

@Data
@NoArgsConstructor
@Embeddable
public class IntensiteSymptome {
    private int valeur;

    public IntensiteSymptome(int valeur) {
        if (valeur < 1 || valeur > 5) {
            throw new IllegalArgumentException("Intensity value must be between 1 and 5.");
        }
        this.valeur = valeur;
    }
}
