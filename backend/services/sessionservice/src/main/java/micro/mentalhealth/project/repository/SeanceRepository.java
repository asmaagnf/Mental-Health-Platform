package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Seance;
import micro.mentalhealth.project.model.StatutSeance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SeanceRepository extends JpaRepository<Seance, UUID> {

    List<Seance> findByTherapeuteId(UUID therapeuteId);
    List<Seance> findByPatientId(UUID patientId);
    List<Seance> findByTherapeuteIdAndStatutSeance(UUID therapeuteId, StatutSeance statut);
    List<Seance> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    @Query(value = "SELECT * FROM seances s WHERE s.therapeute_id = :therapeuteId AND " +
            "s.date_heure < :fin AND " +
            "DATE_ADD(s.date_heure, INTERVAL s.duree_minutes MINUTE) > :debut", nativeQuery = true)
    List<Seance> findConflictingSeances(UUID therapeuteId, LocalDateTime debut, LocalDateTime fin);
    List<Seance> findByTherapeuteIdAndDateHeureBetween(UUID therapeuteId, LocalDateTime start, LocalDateTime end);

}
