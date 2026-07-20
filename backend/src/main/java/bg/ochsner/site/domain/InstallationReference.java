package bg.ochsner.site.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** A completed installation shown on the "Референции" page. */
@Entity
@Table(name = "installation_reference")
public class InstallationReference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 120)
    private String location;

    /** Free-text so it can hold "2023", "Пролет 2024" etc. */
    @Column(length = 40)
    private String year;

    /** Slug of the product category used, e.g. {@code vazduh-voda}. */
    @Column(length = 80)
    private String categorySlug;

    @Column(nullable = false, length = 600)
    private String summary;

    @Column(length = 300)
    private String imageUrl;

    @Column(nullable = false)
    private int displayOrder;

    protected InstallationReference() {
    }

    public InstallationReference(String title, String location, String year, String categorySlug,
                                 String summary, String imageUrl, int displayOrder) {
        this.title = title;
        this.location = location;
        this.year = year;
        this.categorySlug = categorySlug;
        this.summary = summary;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getYear() {
        return year;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public String getSummary() {
        return summary;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
