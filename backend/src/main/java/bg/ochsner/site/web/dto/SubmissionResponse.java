package bg.ochsner.site.web.dto;

/** Uniform 201 response body for both public forms. */
public record SubmissionResponse(Long id, String message) {

    public static SubmissionResponse accepted(Long id) {
        return new SubmissionResponse(id,
                "Благодарим ви! Получихме вашето запитване и ще се свържем с вас в рамките на един работен ден.");
    }
}
