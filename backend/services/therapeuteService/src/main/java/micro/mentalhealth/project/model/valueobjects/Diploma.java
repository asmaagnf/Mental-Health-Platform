package micro.mentalhealth.project.model.valueobjects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Diploma implements Serializable {
    private String title;
    private String institution;
    private Integer year;
    private String imageUrl; // URL to the diploma image
}