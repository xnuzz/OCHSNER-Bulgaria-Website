package bg.ochsner.site.repository;

import bg.ochsner.site.domain.InstallationReference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstallationReferenceRepository extends JpaRepository<InstallationReference, Long> {

    List<InstallationReference> findAllByOrderByDisplayOrderAsc();
}
