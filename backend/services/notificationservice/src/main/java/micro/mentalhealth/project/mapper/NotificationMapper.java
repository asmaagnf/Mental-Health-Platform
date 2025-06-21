package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.NotificationDTO;
import micro.mentalhealth.project.model.Notification;
import micro.mentalhealth.project.model.NotificationType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    public NotificationDTO toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setMessage(notification.getMessage());
        dto.setTimestamp(notification.getTimestamp());
        dto.setRead(notification.isRead());
        dto.setType(notification.getType());
        dto.setRelatedEntityId(notification.getRelatedEntityId());

        return dto;
    }

    public Notification toEntity(NotificationDTO dto) {
        if (dto == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setId(dto.getId());
        notification.setUserId(dto.getUserId());
        notification.setMessage(dto.getMessage());
        notification.setTimestamp(dto.getTimestamp());
        notification.setRead(dto.isRead());
        notification.setType(dto.getType());
        notification.setRelatedEntityId(dto.getRelatedEntityId());

        return notification;
    }

    public List<NotificationDTO> toDTOList(List<Notification> notifications) {
        if (notifications == null) {
            return null;
        }

        return notifications.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Notification> toEntityList(List<NotificationDTO> dtos) {
        if (dtos == null) {
            return null;
        }

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}