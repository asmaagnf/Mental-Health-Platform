package micro.mentalhealth.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import micro.mentalhealth.project.model.NotificationType;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String id;
    private UUID userId;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;
    private NotificationType type;
    private UUID relatedEntityId;
}