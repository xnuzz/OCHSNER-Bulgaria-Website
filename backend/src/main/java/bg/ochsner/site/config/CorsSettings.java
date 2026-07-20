package bg.ochsner.site.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Origins allowed to call the API. Defaults to the Vite dev server so a fresh
 * checkout works without configuration; production overrides via {@code SITE_ORIGIN}.
 */
@ConfigurationProperties(prefix = "site.cors")
public record CorsSettings(List<String> allowedOrigins) {

    public CorsSettings {
        allowedOrigins = (allowedOrigins == null || allowedOrigins.isEmpty())
                ? List.of("http://localhost:5173", "http://127.0.0.1:5173")
                : List.copyOf(allowedOrigins);
    }
}
