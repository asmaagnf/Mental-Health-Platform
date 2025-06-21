package micro.mentalhealth.project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private UUID userId; // Can be patient or therapist ID
    private String message;
    private LocalDateTime timestamp;
    private boolean read;
    private NotificationType type;
    private UUID relatedEntityId; // Could be seanceId, paymentId, etc.
}

