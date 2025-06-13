package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistProfileUpdatedEvent {
    private UUID profileId;
    private LocalDateTime updatedAt;

    public TherapistProfileUpdatedEvent(UUID profileId) {
        this.profileId = profileId;
        this.updatedAt = LocalDateTime.now();
    }
}
