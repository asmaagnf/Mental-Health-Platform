package micro.mentalhealth.project.model.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistRejectedEvent {
    private UUID profileId;
    private String reason;
    private LocalDateTime rejectedAt;

    public TherapistRejectedEvent(UUID profileId, String reason) {
        this.profileId = profileId;
        this.reason = reason;
        this.rejectedAt = LocalDateTime.now();
    }
}
