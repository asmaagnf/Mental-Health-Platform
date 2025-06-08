package micro.mentalhealth.project.model;
import lombok.*;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import micro.mentalhealth.project.model.valueobjects.IntensiteSymptome;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@Getter
@Setter
public class SymptomeJournalier {

    private LocalDate date;

    @Embedded
    private IntensiteSymptome intensite;

    private LocalDateTime timestamp;

    public SymptomeJournalier(LocalDate date, IntensiteSymptome intensite) {
        this.date = date;
        this.intensite = intensite;
        this.timestamp = LocalDateTime.now();
    }
}
