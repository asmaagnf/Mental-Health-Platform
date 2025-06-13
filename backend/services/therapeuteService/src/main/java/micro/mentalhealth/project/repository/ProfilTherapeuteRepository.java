package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfilTherapeuteRepository extends JpaRepository<ProfilTherapeute, UUID> {
    Optional<ProfilTherapeute> findByUserId(UUID userId);
    List<ProfilTherapeute> findByStatutProfil(StatutProfil statutProfil);
    List<ProfilTherapeute> findBySpecialitesContainingIgnoreCaseAndLocalisationContainingIgnoreCaseAndLanguesParleesContainingIgnoreCaseAndStatutProfil(
            String specialty, String localisation, String langue, StatutProfil statutProfil);
    List<ProfilTherapeute> findByStatutProfilAndAnneesExperienceGreaterThanEqual(StatutProfil statutProfil, Integer minExperience);
    List<ProfilTherapeute> findByStatutProfilAndPrixParHeureLessThanEqual(StatutProfil statutProfil, Double maxPricePerHour);
}
