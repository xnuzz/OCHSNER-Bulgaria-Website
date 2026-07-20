package bg.ochsner.site.repository;

import bg.ochsner.site.domain.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    List<ProductCategory> findAllByOrderByDisplayOrderAsc();

    Optional<ProductCategory> findBySlug(String slug);
}
