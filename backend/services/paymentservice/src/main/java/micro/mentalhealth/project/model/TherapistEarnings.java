package micro.mentalhealth.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "therapist_earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistEarnings {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID therapistId;

    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private double totalEarnings = 0.0;

    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private double pendingEarnings = 0.0;
}