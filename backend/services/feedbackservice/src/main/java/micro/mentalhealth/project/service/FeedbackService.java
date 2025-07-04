package micro.mentalhealth.project.service;

import micro.mentalhealth.project.dto.NotificationRequest;
import micro.mentalhealth.project.model.Feedback;
import micro.mentalhealth.project.model.NotificationType;
import micro.mentalhealth.project.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FeedbackService {

    @Autowired
    private NotificationProducer notificationProducer;

    private final FeedbackRepository repository;

    public FeedbackService(FeedbackRepository repository) {
        this.repository = repository;
    }

    public Feedback createFeedback(Feedback feedback) {
        // Assigne un UUID si le champ id est null
        if (feedback.getId() == null) {
            feedback.setId(UUID.randomUUID());
        }
        // Add notification
        String therapistMsg = "New feedback received from patient";
        NotificationRequest request = new NotificationRequest(
                feedback.getTherapistId(),
                therapistMsg,
                NotificationType.FEEDBACK_SUBMITTED,
                feedback.getId()
        );
        notificationProducer.sendNotification(request);
        return repository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return repository.findAll();
    }

    public Optional<Feedback> getFeedbackById(UUID id) {
        return repository.findById(id);
    }

    public void deleteFeedback(UUID id) {
        repository.deleteById(id);
    }

    public List<Feedback> getFeedbacksByTherapist(UUID therapistId) {
        return repository.findByTherapistId(therapistId);
    }

    public Double getAverageRating(UUID therapistId) {
        List<Feedback> feedbacks = repository.findByTherapistId(therapistId);
        return feedbacks.stream()
                .mapToDouble(fb -> fb.getRating().value())
                .average()
                .orElse(0.0);
    }
}
