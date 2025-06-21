package micro.mentalhealth.project.service;

import micro.mentalhealth.project.config.RabbitMQConfig;
import micro.mentalhealth.project.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQListener {
    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeMessageFromQueue(NotificationRequest request) {
        System.out.println("Message received from queue: " + request);
        notificationService.createNotification(request);
    }
}