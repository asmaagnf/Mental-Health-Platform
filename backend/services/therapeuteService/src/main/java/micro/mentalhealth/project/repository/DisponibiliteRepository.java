package micro.mentalhealth.project.repository;

import micro.mentalhealth.project.model.Disponibilite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DisponibiliteRepository extends JpaRepository<Disponibilite, UUID> {
    List<Disponibilite> findByTherapeuteId(UUID therapeuteId);
}


