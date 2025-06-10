package micro.mentalhealth.project.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilTherapeute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID utilisateurId;

    @ElementCollection
    private List<String> specialites;

    @ElementCollection
    private List<String> languesParlees;

    private String localisation;

    @ElementCollection
    private List<Certification> certifications;

    private int anneesExperience;

    @Enumerated(EnumType.STRING)
    private StatutTherapeute statut;

    private float prixParHeure;

    private LocalDateTime createdAt;

    private LocalDateTime validatedAt;


}
