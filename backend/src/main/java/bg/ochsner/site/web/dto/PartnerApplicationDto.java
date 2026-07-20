package bg.ochsner.site.web.dto;

import bg.ochsner.site.domain.PartnerActivity;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Payload of POST /api/v1/partner-applications. */
public record PartnerApplicationDto(

        @NotBlank(message = "Моля, въведете име на фирмата.")
        @Size(max = 180, message = "Името на фирмата е твърде дълго.")
        String companyName,

        @NotNull(message = "Моля, изберете вид дейност.")
        PartnerActivity activity,

        @NotBlank(message = "Моля, въведете лице за контакт.")
        @Size(max = 120, message = "Името е твърде дълго.")
        String contactPerson,

        @NotBlank(message = "Моля, въведете телефон за връзка.")
        @Pattern(regexp = "^[0-9+()\\-\\s]{6,40}$",
                message = "Моля, въведете валиден телефонен номер.")
        String phone,

        @NotBlank(message = "Моля, въведете имейл адрес.")
        @Email(message = "Моля, въведете валиден имейл адрес.")
        @Size(max = 180, message = "Имейл адресът е твърде дълъг.")
        String email,

        @Size(max = 120, message = "Името на населеното място е твърде дълго.")
        String city,

        @Size(max = 4000, message = "Съобщението е твърде дълго.")
        String message,

        @AssertTrue(message = "Необходимо е съгласие с политиката за поверителност.")
        boolean gdprConsent
) {
}
