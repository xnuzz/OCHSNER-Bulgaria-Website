package bg.ochsner.site.web;

import bg.ochsner.site.service.PartnerService;
import bg.ochsner.site.web.dto.PartnerApplicationDto;
import bg.ochsner.site.web.dto.SubmissionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/partner-applications")
public class PartnerApplicationController {

    private final PartnerService service;

    public PartnerApplicationController(PartnerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SubmissionResponse> submit(@Valid @RequestBody PartnerApplicationDto dto) {
        var saved = service.submit(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SubmissionResponse.accepted(saved.getId()));
    }
}
