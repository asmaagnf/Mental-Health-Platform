package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistValidatedEvent {
    private UUID profileId;
    private LocalDateTime validatedAt;

    public TherapistValidatedEvent(UUID profileId) {
        this.profileId = profileId;
        this.validatedAt = LocalDateTime.now();
    }
}
