package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.FeedbackDTO;
import micro.mentalhealth.project.model.Feedback;
import micro.mentalhealth.project.model.Rating;

public class FeedbackMapper {

    public static FeedbackDTO toDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setSeanceId(feedback.getSeanceId());
        dto.setPatientId(feedback.getPatientId());
        dto.setTherapistId(feedback.getTherapistId());
        dto.setRating(feedback.getRating().value()); // VO -> simple int
        dto.setComment(feedback.getComment());
        dto.setSentAt(feedback.getSentAt());
        return dto;
    }

    public static Feedback toEntity(FeedbackDTO dto) {
        Feedback feedback = new Feedback();
        feedback.setId(dto.getId());
        feedback.setSeanceId(dto.getSeanceId());
        feedback.setPatientId(dto.getPatientId());
        feedback.setTherapistId(dto.getTherapistId());
        feedback.setRating(new Rating(dto.getRating())); // int -> VO
        feedback.setComment(dto.getComment());
        feedback.setSentAt(dto.getSentAt() != null ? dto.getSentAt() : feedback.getSentAt());
        return feedback;
    }
}
