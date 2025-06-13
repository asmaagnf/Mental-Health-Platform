package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.TherapistEarnings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TherapistEarningsRepository extends JpaRepository<TherapistEarnings, UUID> {
    Optional<TherapistEarnings> findByTherapistId(UUID therapistId);
}