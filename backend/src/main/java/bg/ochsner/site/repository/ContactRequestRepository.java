package bg.ochsner.site.repository;

import bg.ochsner.site.domain.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
}
