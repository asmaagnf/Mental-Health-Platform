package micro.mentalhealth.project.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "feedbacks")
@Getter
@Setter
public class Feedback {

    @Id
    private UUID id;

    @NotNull
    private UUID seanceId;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID therapistId;

    @NotNull
    private Rating rating;

    private String comment;

    @NotNull
    private LocalDateTime sentAt;

    public Feedback() {
        this.sentAt = LocalDateTime.now();
    }
}
