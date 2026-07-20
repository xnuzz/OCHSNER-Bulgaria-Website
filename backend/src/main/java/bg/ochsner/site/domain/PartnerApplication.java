package bg.ochsner.site.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** A B2B application from the "Стани партньор" form. */
@Entity
@Table(name = "partner_application")
public class PartnerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PartnerActivity activity;

    @Column(nullable = false, length = 120)
    private String contactPerson;

    @Column(nullable = false, length = 40)
    private String phone;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(length = 120)
    private String city;

    @Column(length = 4000)
    private String message;

    @Column(nullable = false)
    private boolean gdprConsent;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    private Instant notifiedAt;

    protected PartnerApplication() {
    }

    public PartnerApplication(String companyName, PartnerActivity activity, String contactPerson,
                              String phone, String email, String city, String message,
                              boolean gdprConsent) {
        this.companyName = companyName;
        this.activity = activity;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.city = city;
        this.message = message;
        this.gdprConsent = gdprConsent;
        this.submittedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public PartnerActivity getActivity() {
        return activity;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getCity() {
        return city;
    }

    public String getMessage() {
        return message;
    }

    public boolean isGdprConsent() {
        return gdprConsent;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public Instant getNotifiedAt() {
        return notifiedAt;
    }

    public void markNotified() {
        this.notifiedAt = Instant.now();
    }
}
