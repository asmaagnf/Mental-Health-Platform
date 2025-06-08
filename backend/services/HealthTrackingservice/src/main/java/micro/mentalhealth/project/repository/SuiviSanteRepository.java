package micro.mentalhealth.project.repository;
import micro.mentalhealth.project.model.SuiviSante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuiviSanteRepository extends JpaRepository<SuiviSante, UUID> {

    Optional<SuiviSante> findByPatientId(UUID patientId);
    @Query("SELECT s FROM SuiviSante s LEFT JOIN FETCH s.symptomes WHERE s.patientId = :patientId")
    Optional<SuiviSante> findByPatientIdWithSymptoms(@Param("patientId") UUID patientId);
}