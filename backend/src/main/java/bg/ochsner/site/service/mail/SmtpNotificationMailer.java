package bg.ochsner.site.service.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

/** Sends notifications over SMTP. Active only when {@code spring.mail.host} is set. */
public class SmtpNotificationMailer implements NotificationMailer {

    private static final Logger log = LoggerFactory.getLogger(SmtpNotificationMailer.class);

    private final JavaMailSender mailSender;
    private final MailProperties properties;

    public SmtpNotificationMailer(JavaMailSender mailSender, MailProperties properties) {
        this.mailSender = mailSender;
        this.properties = properties;
    }

    @Override
    public void sendToOwner(String subject, String body, String replyTo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(properties.from());
        message.setTo(properties.recipient());
        message.setSubject(subject);
        message.setText(body);
        if (replyTo != null && !replyTo.isBlank()) {
            message.setReplyTo(replyTo);
        }
        try {
            mailSender.send(message);
        } catch (MailException e) {
            // The submission is already persisted; a failed notification must not fail the request.
            log.error("Failed to send notification e-mail for: {}", subject, e);
        }
    }
}
