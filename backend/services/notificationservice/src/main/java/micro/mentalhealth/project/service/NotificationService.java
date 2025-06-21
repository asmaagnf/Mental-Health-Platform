package micro.mentalhealth.project.service;

import micro.mentalhealth.project.dto.NotificationDTO;
import micro.mentalhealth.project.dto.NotificationRequest;
import micro.mentalhealth.project.mapper.NotificationMapper;
import micro.mentalhealth.project.model.Notification;
import micro.mentalhealth.project.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repository;
    private final NotificationMapper mapper;

    public NotificationDTO createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .message(request.getMessage())
                .timestamp(LocalDateTime.now())
                .read(false)
                .type(request.getType())
                .relatedEntityId(request.getRelatedEntityId())
                .build();
        return mapper.toDTO(repository.save(notification));
    }

    public List<NotificationDTO> getUserNotifications(UUID userId) {
        return mapper.toDTOList(repository.findByUserId(userId));
    }

    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return mapper.toDTOList(repository.findByUserIdAndRead(userId, false));
    }

    public NotificationDTO markAsRead(String notificationId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return mapper.toDTO(repository.save(notification));
    }

    public long getUnreadCount(UUID userId) {
        return repository.countByUserIdAndRead(userId, false);
    }
}