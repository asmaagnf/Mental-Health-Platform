package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.StatutTherapeute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProfilTherapeuteRepository extends JpaRepository<ProfilTherapeute, UUID> {
    List<ProfilTherapeute> findAllByStatut(StatutTherapeute statut);

}

