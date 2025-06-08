package micro.mentalhealth.project.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.OptionalDouble;
import java.util.NoSuchElementException;

import lombok.Setter;
import micro.mentalhealth.project.model.valueobjects.IntensiteSymptome;

@Entity
@Table(name = "suivi_sante")
@Data
@NoArgsConstructor
@Getter
@Setter
public class SuiviSante {

    @Id
    @GeneratedValue
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false)
    private UUID patientId;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "humeurs_journalisees", joinColumns = @JoinColumn(name = "suivi_sante_id"))
    private List<HumeurJournalisee> humeurs = new ArrayList<>();

    @OneToMany(mappedBy = "suiviSante", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SymptomeSuivi> symptomes = new ArrayList<>();

    public SuiviSante(UUID patientId) {
        this.patientId = patientId;
        this.humeurs = new ArrayList<>();
        this.symptomes = new ArrayList<>();
    }

    public void ajouterHumeur(HumeurJournalisee humeur) {
        if (humeur == null || humeur.getDate() == null) {
            throw new IllegalArgumentException("Mood entry and its date cannot be null.");
        }
        boolean alreadyLogged = this.humeurs.stream()
                .anyMatch(h -> h.getDate().equals(humeur.getDate()));

        if (alreadyLogged) {
            throw new IllegalArgumentException("Mood for " + humeur.getDate() + " has already been logged.");
        }
        this.humeurs.add(humeur);
    }

    public List<HumeurJournalisee> getHumeurHistory() {
        this.humeurs.sort((h1, h2) -> h2.getDate().compareTo(h1.getDate()));
        return new ArrayList<>(this.humeurs);
    }

    public double getMoyenneHumeur(int lastDays) {
        if (lastDays <= 0) {
            throw new IllegalArgumentException("Number of days must be positive.");
        }

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(lastDays - 1);

        OptionalDouble average = this.humeurs.stream()
                .filter(h -> !h.getDate().isBefore(startDate) && !h.getDate().isAfter(endDate))
                .mapToInt(h -> {
                    switch (h.getNiveau()) {
                        case VERY_LOW: return 1;
                        case LOW: return 2;
                        case AVERAGE: return 3;
                        case GOOD: return 4;
                        case EXCELLENT: return 5;
                        default: return 0;
                    }
                })
                .average();

        return average.orElse(0.0);
    }

    public SymptomeSuivi ajouterSymptome(String nomSymptome) {
        if (nomSymptome == null || nomSymptome.trim().isEmpty()) {
            throw new IllegalArgumentException("Symptom name cannot be null or empty.");
        }
        boolean alreadyTracking = this.symptomes.stream()
                .anyMatch(s -> s.getNom().equalsIgnoreCase(nomSymptome));

        if (alreadyTracking) {
            throw new IllegalArgumentException("Symptom '" + nomSymptome + "' is already being tracked.");
        }

        SymptomeSuivi nouveauSymptome = new SymptomeSuivi(nomSymptome, this);
        this.symptomes.add(nouveauSymptome);
        return nouveauSymptome;
    }

    public void enregistrerObservationSymptome(String nomSymptome, IntensiteSymptome intensite) {
        if (nomSymptome == null || nomSymptome.trim().isEmpty() || intensite == null) {
            throw new IllegalArgumentException("Symptom name and intensity cannot be null.");
        }
        SymptomeSuivi symptomeToUpdate = this.symptomes.stream()
                .filter(s -> s.getNom().equalsIgnoreCase(nomSymptome))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Symptom '" + nomSymptome + "' is not being tracked for this patient."));

        symptomeToUpdate.ajouterObservation(new SymptomeJournalier(LocalDate.now(), intensite));
    }

    public List<SymptomeJournalier> getHistoriqueSymptome(String nomSymptome) {
        if (nomSymptome == null || nomSymptome.trim().isEmpty()) {
            throw new IllegalArgumentException("Symptom name cannot be null or empty.");
        }
        SymptomeSuivi symptome = this.symptomes.stream()
                .filter(s -> s.getNom().equalsIgnoreCase(nomSymptome))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Symptom '" + nomSymptome + "' is not being tracked for this patient."));

        return symptome.getHistorique();
    }
}
