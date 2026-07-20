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

/** A submission from the public contact form ("Контакти"). */
@Entity
@Table(name = "contact_request")
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 40)
    private String phone;

    @Column(nullable = false, length = 180)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private RequestType requestType;

    @Column(length = 120)
    private String city;

    @Column(nullable = false, length = 4000)
    private String message;

    @Column(nullable = false)
    private boolean gdprConsent;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    /** Set when the notification e-mail was handed off to the mail sender. */
    private Instant notifiedAt;

    protected ContactRequest() {
    }

    public ContactRequest(String name, String phone, String email, RequestType requestType,
                          String city, String message, boolean gdprConsent) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.requestType = requestType;
        this.city = city;
        this.message = message;
        this.gdprConsent = gdprConsent;
        this.submittedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public RequestType getRequestType() {
        return requestType;
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
