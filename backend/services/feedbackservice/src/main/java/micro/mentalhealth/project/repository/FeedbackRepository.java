package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends MongoRepository<Feedback, UUID> {
    List<Feedback> findByTherapistId(UUID therapistId);
}
