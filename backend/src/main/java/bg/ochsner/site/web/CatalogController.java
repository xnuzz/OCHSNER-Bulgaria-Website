package bg.ochsner.site.web;

import bg.ochsner.site.service.CatalogService;
import bg.ochsner.site.web.dto.InstallationReferenceDto;
import bg.ochsner.site.web.dto.ProductCategoryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {

    private final CatalogService service;

    public CatalogController(CatalogService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public List<ProductCategoryDto> products() {
        return service.listProducts();
    }

    @GetMapping("/products/{slug}")
    public ProductCategoryDto product(@PathVariable String slug) {
        return service.getProduct(slug);
    }

    @GetMapping("/references")
    public List<InstallationReferenceDto> references() {
        return service.listReferences();
    }
}
