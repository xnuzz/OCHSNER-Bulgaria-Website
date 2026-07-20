package bg.ochsner.site.web;

import bg.ochsner.site.service.ContactService;
import bg.ochsner.site.web.dto.ContactRequestDto;
import bg.ochsner.site.web.dto.SubmissionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SubmissionResponse> submit(@Valid @RequestBody ContactRequestDto dto) {
        var saved = service.submit(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SubmissionResponse.accepted(saved.getId()));
    }
}
