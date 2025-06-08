package micro.mentalhealth.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@Getter
@Setter
public class SymptomeSuivi {

    @Id
    @GeneratedValue
    @Column(nullable = false)
    private UUID id;

    private String nom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suivi_sante_id", nullable = false)
    private SuiviSante suiviSante;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "symptomes_journaliers", joinColumns = @JoinColumn(name = "symptome_suivi_id"))
    private List<SymptomeJournalier> journaux = new ArrayList<>();

    public SymptomeSuivi(String nom, String emoji, SuiviSante suiviSante) {
        this.nom = nom;
        this.suiviSante = suiviSante;
        this.journaux = new ArrayList<>();
    }

    public SymptomeSuivi(String nom, SuiviSante suiviSante) {
        this.nom = nom;
        this.suiviSante = suiviSante;
        this.journaux = new ArrayList<>();
    }

    public void ajouterObservation(SymptomeJournalier observation) {
        if (observation == null || observation.getDate() == null) {
            throw new IllegalArgumentException("Symptom observation and its date cannot be null.");
        }
        boolean alreadyLogged = this.journaux.stream()
                .anyMatch(o -> o.getDate().equals(observation.getDate()));

        if (alreadyLogged) {
            throw new IllegalArgumentException("Observation for symptom " + this.nom + " on " + observation.getDate() + " has already been logged.");
        }
        this.journaux.add(observation);
    }

    public List<SymptomeJournalier> getHistorique() {
        this.journaux.sort((s1, s2) -> s2.getDate().compareTo(s1.getDate()));
        return new ArrayList<>(this.journaux);
    }
}
