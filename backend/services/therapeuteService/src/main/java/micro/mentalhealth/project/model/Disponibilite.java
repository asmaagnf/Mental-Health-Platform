package micro.mentalhealth.project.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disponibilite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID therapeuteId;

    @Enumerated(EnumType.STRING)
    private JourDisponibilite jour; // Enum: LUNDI à DIMANCHE

    @Embedded
    private PlageHoraire plageHoraire;
}

