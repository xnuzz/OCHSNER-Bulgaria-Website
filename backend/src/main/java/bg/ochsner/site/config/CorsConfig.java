package bg.ochsner.site.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * CORS for the split dev setup (Vite on :5173, API on :8080).
 * Allowed origins come from {@code site.cors.allowed-origins} so production can lock this down.
 */
@Configuration
public class CorsConfig {

    @Bean
    WebMvcConfigurer corsConfigurer(CorsSettings settings) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(settings.allowedOrigins().toArray(String[]::new))
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowedHeaders("Content-Type", "Accept")
                        .maxAge(3600);
            }
        };
    }

    @ConfigurationProperties(prefix = "site.cors")
    public record CorsSettings(List<String> allowedOrigins) {

        public CorsSettings {
            allowedOrigins = (allowedOrigins == null || allowedOrigins.isEmpty())
                    ? List.of("http://localhost:5173", "http://127.0.0.1:5173")
                    : List.copyOf(allowedOrigins);
        }
    }
}
