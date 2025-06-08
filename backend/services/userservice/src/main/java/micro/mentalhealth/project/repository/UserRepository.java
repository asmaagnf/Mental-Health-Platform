package micro.mentalhealth.project.repository;
import java.util.UUID;
import micro.mentalhealth.project.model.Email;
import micro.mentalhealth.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(Email email);
    boolean existsByEmail(Email email);
}
