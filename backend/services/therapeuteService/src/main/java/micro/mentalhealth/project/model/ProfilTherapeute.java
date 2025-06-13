package micro.mentalhealth.project.model;

import micro.mentalhealth.project.model.valueobjects.Diploma;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profils_therapeute")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfilTherapeute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId; // Unique identifier for the user (therapist)

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "therapeute_specialites", joinColumns = @JoinColumn(name = "therapeute_id"))
    @Column(name = "specialite")
    private List<String> specialites = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Min(0)
    private Integer anneesExperience;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "therapeute_diplomas", joinColumns = @JoinColumn(name = "therapeute_id"))
    @Valid
    private List<Diploma> diplomas = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "therapeute_langues", joinColumns = @JoinColumn(name = "therapeute_id"))
    @Column(name = "langue")
    private List<String> languesParlees = new ArrayList<>();

    private String localisation;

    private Boolean available;

    @DecimalMin(value = "0.0", inclusive = false)
    private Double prixParHeure;

    @Enumerated(EnumType.STRING)
    @NotNull
    private StatutProfil statutProfil;

    // Constructor for initial creation (by Auth Service)
    public ProfilTherapeute(UUID userId) {
        this.userId = userId;
        this.statutProfil = StatutProfil.EN_ATTENTE;
        this.available = false; // Default to not available until profile is complete/validated
        this.specialites = new ArrayList<>();
        this.diplomas = new ArrayList<>();
        this.languesParlees = new ArrayList<>();
    }
}
