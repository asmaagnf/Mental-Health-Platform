package micro.mentalhealth.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import micro.mentalhealth.project.model.NotificationType;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private UUID userId;
    private String message;
    private NotificationType type;
    private UUID relatedEntityId;
}