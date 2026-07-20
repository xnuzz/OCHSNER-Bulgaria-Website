package bg.ochsner.site.web.dto;

import bg.ochsner.site.domain.RequestType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload of POST /api/v1/contact.
 * Validation messages are in Bulgarian because they are surfaced verbatim in the UI.
 */
public record ContactRequestDto(

        @NotBlank(message = "Моля, въведете вашето име.")
        @Size(max = 120, message = "Името е твърде дълго.")
        String name,

        @NotBlank(message = "Моля, въведете телефон за връзка.")
        @Pattern(regexp = "^[0-9+()\\-\\s]{6,40}$",
                message = "Моля, въведете валиден телефонен номер.")
        String phone,

        @NotBlank(message = "Моля, въведете имейл адрес.")
        @Email(message = "Моля, въведете валиден имейл адрес.")
        @Size(max = 180, message = "Имейл адресът е твърде дълъг.")
        String email,

        @NotNull(message = "Моля, изберете тип запитване.")
        RequestType requestType,

        @Size(max = 120, message = "Името на населеното място е твърде дълго.")
        String city,

        @NotBlank(message = "Моля, опишете накратко вашето запитване.")
        @Size(min = 10, max = 4000, message = "Съобщението трябва да е между 10 и 4000 символа.")
        String message,

        @AssertTrue(message = "Необходимо е съгласие с политиката за поверителност.")
        boolean gdprConsent
) {
}
