package bg.ochsner.site.web;

import bg.ochsner.site.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactService contactService;

    @Test
    void rejectsInvalidPayloadWithBulgarianFieldMessages() throws Exception {
        String body = """
                {
                  "name": "",
                  "phone": "не-е-телефон!",
                  "email": "not-an-email",
                  "requestType": null,
                  "city": "София",
                  "message": "кратко",
                  "gdprConsent": false
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Моля, проверете попълнените данни."))
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.requestType").exists())
                .andExpect(jsonPath("$.fieldErrors.gdprConsent").exists());
    }

    @Test
    void rejectsMissingGdprConsent() throws Exception {
        String body = """
                {
                  "name": "Иван Петров",
                  "phone": "+359888123456",
                  "email": "ivan@example.com",
                  "requestType": "HEAT_PUMP_INTEREST",
                  "city": "Пловдив",
                  "message": "Интересува ме термопомпа за къща 150 кв.м.",
                  "gdprConsent": false
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.gdprConsent").exists());
    }
}
