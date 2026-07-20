package bg.ochsner.site.service.mail;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Site-specific mail settings (distinct from Spring's own {@code spring.mail.*}). */
@ConfigurationProperties(prefix = "site.mail")
public record MailProperties(
        /* Address that receives form notifications. */
        String recipient,
        /* Envelope sender. Must be an address the SMTP server accepts. */
        String from
) {

    public MailProperties {
        recipient = recipient == null ? "office@ochsner.bg" : recipient;
        from = from == null ? "no-reply@ochsner.bg" : from;
    }
}
