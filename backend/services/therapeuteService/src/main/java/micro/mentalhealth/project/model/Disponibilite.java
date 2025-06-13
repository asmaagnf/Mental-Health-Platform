package micro.mentalhealth.project.model;

import micro.mentalhealth.project.model.valueobjects.TimeRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.util.UUID;

@Entity
@Table(name = "disponibilites")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disponibilite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private UUID therapeuteId; // Foreign key to ProfilTherapeute (UUID as String)

    @Enumerated(EnumType.STRING)
    @NotNull
    private DayOfWeek jour;

    @Embedded
    @Valid
    private TimeRange plageHoraire;
}
