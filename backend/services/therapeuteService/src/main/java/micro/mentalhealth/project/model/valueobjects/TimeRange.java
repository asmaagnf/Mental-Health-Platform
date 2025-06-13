package micro.mentalhealth.project.model.valueobjects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class TimeRange implements Serializable {
    @NotNull
    private LocalTime heureDebut;

    @NotNull
    private LocalTime heureFin;
}
