package micro.mentalhealth.project.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlageHoraireDTO {
    private LocalTime heureDebut;
    private LocalTime heureFin;

}
