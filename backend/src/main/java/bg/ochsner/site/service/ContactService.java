package bg.ochsner.site.service;

import bg.ochsner.site.domain.ContactRequest;
import bg.ochsner.site.domain.RequestType;
import bg.ochsner.site.repository.ContactRequestRepository;
import bg.ochsner.site.service.mail.NotificationMailer;
import bg.ochsner.site.web.dto.ContactRequestDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactRequestRepository repository;
    private final NotificationMailer mailer;

    public ContactService(ContactRequestRepository repository, NotificationMailer mailer) {
        this.repository = repository;
        this.mailer = mailer;
    }

    @Transactional
    public ContactRequest submit(ContactRequestDto dto) {
        ContactRequest request = repository.save(new ContactRequest(
                dto.name().trim(),
                dto.phone().trim(),
                dto.email().trim().toLowerCase(),
                dto.requestType(),
                dto.city() == null ? null : dto.city().trim(),
                dto.message().trim(),
                dto.gdprConsent()
        ));

        mailer.sendToOwner(
                "Ново запитване от сайта — " + label(request.getRequestType()),
                buildBody(request),
                request.getEmail()
        );
        request.markNotified();
        return request;
    }

    private String buildBody(ContactRequest r) {
        return """
                Ново запитване от формата за контакт.

                Име:          %s
                Телефон:      %s
                Имейл:        %s
                Тип запитване: %s
                Град:         %s

                Съобщение:
                %s

                Подадено на: %s
                """.formatted(
                r.getName(),
                r.getPhone(),
                r.getEmail(),
                label(r.getRequestType()),
                r.getCity() == null || r.getCity().isBlank() ? "-" : r.getCity(),
                r.getMessage(),
                r.getSubmittedAt());
    }

    private String label(RequestType type) {
        return switch (type) {
            case HEAT_PUMP_INTEREST -> "интерес към термопомпа";
            case EXISTING_CUSTOMER -> "въпрос от клиент";
            case OTHER -> "друго";
        };
    }
}
