package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Remboursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RemboursementRepository extends JpaRepository<Remboursement, UUID> {
    // No custom queries needed for now
}
