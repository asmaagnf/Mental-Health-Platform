package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistAvailabilityChangedEvent {
    private UUID therapeuteId;
    private UUID disponibiliteId;
    private LocalDateTime changedAt;

    public TherapistAvailabilityChangedEvent(UUID therapeuteId, UUID disponibiliteId) {
        this.therapeuteId = therapeuteId;
        this.disponibiliteId = disponibiliteId;
        this.changedAt = LocalDateTime.now();
    }
}
