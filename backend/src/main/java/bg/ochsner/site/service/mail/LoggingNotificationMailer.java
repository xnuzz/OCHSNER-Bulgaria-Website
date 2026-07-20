package bg.ochsner.site.service.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Default mailer for local dev: writes the notification to the log instead of sending it.
 * Replaced by {@link SmtpNotificationMailer} as soon as {@code spring.mail.host} is configured.
 */
public class LoggingNotificationMailer implements NotificationMailer {

    private static final Logger log = LoggerFactory.getLogger(LoggingNotificationMailer.class);

    private final MailProperties properties;

    public LoggingNotificationMailer(MailProperties properties) {
        this.properties = properties;
    }

    @Override
    public void sendToOwner(String subject, String body, String replyTo) {
        log.info("""
                        [MAIL — not sent, no SMTP host configured]
                        To:       {}
                        Reply-To: {}
                        Subject:  {}
                        {}""",
                properties.recipient(), replyTo == null ? "-" : replyTo, subject, body);
    }
}
