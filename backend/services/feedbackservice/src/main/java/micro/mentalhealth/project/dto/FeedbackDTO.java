package micro.mentalhealth.project.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public class FeedbackDTO {

    private UUID id;

    @NotNull
    private UUID seanceId;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID therapistId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating; // côté API, on garde int

    private String comment;

    private LocalDateTime sentAt;

    public FeedbackDTO() {
    }

    public FeedbackDTO(UUID id, UUID seanceId, UUID patientId, UUID therapistId, Integer rating, String comment, LocalDateTime sentAt) {
        this.id = id;
        this.seanceId = seanceId;
        this.patientId = patientId;
        this.therapistId = therapistId;
        this.rating = rating;
        this.comment = comment;
        this.sentAt = sentAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSeanceId() {
        return seanceId;
    }

    public void setSeanceId(UUID seanceId) {
        this.seanceId = seanceId;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public UUID getTherapistId() {
        return therapistId;
    }

    public void setTherapistId(UUID therapistId) {
        this.therapistId = therapistId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
