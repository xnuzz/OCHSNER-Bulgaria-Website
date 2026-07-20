package bg.ochsner.site.service.mail;

/**
 * Thin abstraction over outbound mail so local dev can run without SMTP.
 *
 * @see LoggingNotificationMailer
 * @see SmtpNotificationMailer
 */
public interface NotificationMailer {

    /**
     * Sends a plain-text notification to the site owner.
     *
     * @param subject subject line
     * @param body    plain-text body
     * @param replyTo address of the person who submitted the form, or {@code null}
     */
    void sendToOwner(String subject, String body, String replyTo);
}
