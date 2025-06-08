package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    // Custom query methods
    List<Payment> findByPatientId(UUID patientId);

    List<Payment> findByTherapistId(UUID therapistId);
    Optional<Payment> findBySeanceId(UUID seanceId);
}
