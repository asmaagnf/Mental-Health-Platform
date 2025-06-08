package micro.mentalhealth.project.model;
import lombok.*;

import jakarta.persistence.Embeddable;
import micro.mentalhealth.project.model.valueobjects.NiveauHumeur;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Embeddable
public class HumeurJournalisee {

    private LocalDate date;
    private NiveauHumeur niveau;
    private String note;
    private LocalDateTime timestamp;

    public HumeurJournalisee(LocalDate date, NiveauHumeur niveau, String note) {
        this.date = date;
        this.niveau = niveau;
        this.note = note;
        this.timestamp = LocalDateTime.now();
    }
}
