package bg.ochsner.site.config;

import bg.ochsner.site.service.mail.LoggingNotificationMailer;
import bg.ochsner.site.service.mail.MailProperties;
import bg.ochsner.site.service.mail.NotificationMailer;
import bg.ochsner.site.service.mail.SmtpNotificationMailer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.util.StringUtils;

/**
 * Picks the mailer implementation once, at startup: SMTP if a host is configured,
 * otherwise a logging stub so the app runs out of the box.
 */
@Configuration
public class MailConfig {

    @Bean
    NotificationMailer notificationMailer(Environment environment,
                                          MailProperties properties,
                                          ObjectProvider<JavaMailSender> mailSender) {
        String host = environment.getProperty("spring.mail.host");
        JavaMailSender sender = mailSender.getIfAvailable();
        if (StringUtils.hasText(host) && sender != null) {
            return new SmtpNotificationMailer(sender, properties);
        }
        return new LoggingNotificationMailer(properties);
    }
}
