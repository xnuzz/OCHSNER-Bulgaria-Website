package bg.ochsner.site.web.dto;

import bg.ochsner.site.domain.ProductCategory;

import java.util.List;

/** Read model for GET /api/v1/products. */
public record ProductCategoryDto(
        String slug,
        String title,
        String shortDescription,
        String description,
        List<String> advantages,
        String suitableFor,
        String imageUrl,
        String datasheetUrl
) {

    public static ProductCategoryDto from(ProductCategory category) {
        return new ProductCategoryDto(
                category.getSlug(),
                category.getTitle(),
                category.getShortDescription(),
                category.getDescription(),
                List.copyOf(category.getAdvantages()),
                category.getSuitableFor(),
                category.getImageUrl(),
                category.getDatasheetUrl()
        );
    }
}
