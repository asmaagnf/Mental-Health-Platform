package micro.mentalhealth.project.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlageHoraire {
    private String debut;
    private String fin;
}

