package bg.ochsner.site.service;

import bg.ochsner.site.domain.PartnerActivity;
import bg.ochsner.site.domain.PartnerApplication;
import bg.ochsner.site.repository.PartnerApplicationRepository;
import bg.ochsner.site.service.mail.NotificationMailer;
import bg.ochsner.site.web.dto.PartnerApplicationDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartnerService {

    private final PartnerApplicationRepository repository;
    private final NotificationMailer mailer;

    public PartnerService(PartnerApplicationRepository repository, NotificationMailer mailer) {
        this.repository = repository;
        this.mailer = mailer;
    }

    @Transactional
    public PartnerApplication submit(PartnerApplicationDto dto) {
        PartnerApplication application = repository.save(new PartnerApplication(
                dto.companyName().trim(),
                dto.activity(),
                dto.contactPerson().trim(),
                dto.phone().trim(),
                dto.email().trim().toLowerCase(),
                dto.city() == null ? null : dto.city().trim(),
                dto.message() == null ? null : dto.message().trim(),
                dto.gdprConsent()
        ));

        mailer.sendToOwner(
                "Нова партньорска заявка — " + application.getCompanyName(),
                buildBody(application),
                application.getEmail()
        );
        application.markNotified();
        return application;
    }

    private String buildBody(PartnerApplication a) {
        return """
                Нова заявка за партньорство.

                Фирма:         %s
                Дейност:       %s
                Лице за контакт: %s
                Телефон:       %s
                Имейл:         %s
                Град:          %s

                Съобщение:
                %s

                Подадена на: %s
                """.formatted(
                a.getCompanyName(),
                label(a.getActivity()),
                a.getContactPerson(),
                a.getPhone(),
                a.getEmail(),
                a.getCity() == null || a.getCity().isBlank() ? "-" : a.getCity(),
                a.getMessage() == null || a.getMessage().isBlank() ? "-" : a.getMessage(),
                a.getSubmittedAt());
    }

    private String label(PartnerActivity activity) {
        return switch (activity) {
            case INSTALLER -> "монтажник / ВиК-ОВК техник";
            case HVAC_COMPANY -> "ОВК фирма";
            case BUILDER -> "строителна фирма / инвеститор";
            case ARCHITECT -> "архитект / проектант";
            case OTHER -> "друго";
        };
    }
}
