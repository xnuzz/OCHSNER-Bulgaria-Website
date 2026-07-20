package bg.ochsner.site.web.error;

import java.time.Instant;
import java.util.Map;

/**
 * Uniform error body. {@code fieldErrors} maps a form field name to a Bulgarian message
 * so the frontend can render errors inline next to the input.
 */
public record ApiError(
        int status,
        String message,
        Map<String, String> fieldErrors,
        Instant timestamp
) {

    public static ApiError of(int status, String message) {
        return new ApiError(status, message, Map.of(), Instant.now());
    }

    public static ApiError validation(String message, Map<String, String> fieldErrors) {
        return new ApiError(400, message, fieldErrors, Instant.now());
    }
}
