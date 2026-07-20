package bg.ochsner.site.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * One of the four heat pump categories shown on the site.
 * Seeded at startup, but modelled as a real entity so an admin/CMS can take over later
 * without changing the API contract the frontend consumes.
 */
@Entity
@Table(name = "product_category")
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** URL-safe identifier, e.g. {@code vazduh-voda}. */
    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 160)
    private String title;

    /** One-line summary used on the home page cards. */
    @Column(nullable = false, length = 400)
    private String shortDescription;

    @Column(nullable = false, length = 2000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_category_advantage", joinColumns = @JoinColumn(name = "category_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "advantage", length = 400)
    private List<String> advantages = new ArrayList<>();

    /** "Подходящо за" — who this category fits. */
    @Column(nullable = false, length = 600)
    private String suitableFor;

    @Column(length = 300)
    private String imageUrl;

    /** Placeholder link to the full spec sheet. */
    @Column(length = 300)
    private String datasheetUrl;

    @Column(nullable = false)
    private int displayOrder;

    protected ProductCategory() {
    }

    public ProductCategory(String slug, String title, String shortDescription, String description,
                           List<String> advantages, String suitableFor, String imageUrl,
                           String datasheetUrl, int displayOrder) {
        this.slug = slug;
        this.title = title;
        this.shortDescription = shortDescription;
        this.description = description;
        this.advantages = new ArrayList<>(advantages);
        this.suitableFor = suitableFor;
        this.imageUrl = imageUrl;
        this.datasheetUrl = datasheetUrl;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getAdvantages() {
        return advantages;
    }

    public String getSuitableFor() {
        return suitableFor;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDatasheetUrl() {
        return datasheetUrl;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
