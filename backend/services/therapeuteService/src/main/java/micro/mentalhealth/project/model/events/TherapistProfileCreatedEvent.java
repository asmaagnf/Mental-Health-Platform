package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistProfileCreatedEvent {
    private UUID profileId;
    private UUID userId;
    private LocalDateTime createdAt;

    public TherapistProfileCreatedEvent(UUID userId) {
        this.profileId = UUID.randomUUID();
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
}
