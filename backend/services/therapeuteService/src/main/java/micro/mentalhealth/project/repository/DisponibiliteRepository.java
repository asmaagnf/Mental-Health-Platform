package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Disponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, UUID> {
    List<Disponibilite> findByTherapeuteId(UUID therapeuteId);
    Optional<Disponibilite> findByTherapeuteIdAndJour(UUID therapeuteId, DayOfWeek jour);
}
