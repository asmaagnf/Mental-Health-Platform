package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Seance;
import micro.mentalhealth.project.model.StatutSeance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SeanceRepository extends JpaRepository<Seance, UUID> {

    List<Seance> findByTherapeuteId(UUID therapeuteId);
    List<Seance> findByPatientId(UUID patientId);
    List<Seance> findByTherapeuteIdAndStatutSeance(UUID therapeuteId, StatutSeance statut);
    List<Seance> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    boolean existsByTherapeuteIdAndDateHeure(UUID therapeuteId, LocalDateTime dateHeure);
}
