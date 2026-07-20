package bg.ochsner.site.web.dto;

import bg.ochsner.site.domain.InstallationReference;

/** Read model for GET /api/v1/references. */
public record InstallationReferenceDto(
        Long id,
        String title,
        String location,
        String year,
        String categorySlug,
        String summary,
        String imageUrl
) {

    public static InstallationReferenceDto from(InstallationReference reference) {
        return new InstallationReferenceDto(
                reference.getId(),
                reference.getTitle(),
                reference.getLocation(),
                reference.getYear(),
                reference.getCategorySlug(),
                reference.getSummary(),
                reference.getImageUrl()
        );
    }
}
