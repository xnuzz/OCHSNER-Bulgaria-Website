package bg.ochsner.site.service;

import bg.ochsner.site.repository.InstallationReferenceRepository;
import bg.ochsner.site.repository.ProductCategoryRepository;
import bg.ochsner.site.web.dto.InstallationReferenceDto;
import bg.ochsner.site.web.dto.ProductCategoryDto;
import bg.ochsner.site.web.error.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Read-side service for the public catalog content (products + references). */
@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final ProductCategoryRepository products;
    private final InstallationReferenceRepository references;

    public CatalogService(ProductCategoryRepository products, InstallationReferenceRepository references) {
        this.products = products;
        this.references = references;
    }

    public List<ProductCategoryDto> listProducts() {
        return products.findAllByOrderByDisplayOrderAsc().stream()
                .map(ProductCategoryDto::from)
                .toList();
    }

    public ProductCategoryDto getProduct(String slug) {
        return products.findBySlug(slug)
                .map(ProductCategoryDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Продуктовата категория не е намерена."));
    }

    public List<InstallationReferenceDto> listReferences() {
        return references.findAllByOrderByDisplayOrderAsc().stream()
                .map(InstallationReferenceDto::from)
                .toList();
    }
}
