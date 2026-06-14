package de.th_ro.sqs_verkehrsapp.config;

import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.domain.exception.UserException;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Initializes application data during startup.
 * <p>
 * Creates default data required for development or testing environments.
 */
@Configuration
public class DataInitializer {

    /**
     * Creates a startup task that initializes a default test user.
     *
     * @param authUseCase use case for user registration
     * @return a command line runner executed during application startup
     */
    @Bean
    CommandLineRunner init(AuthUseCase authUseCase) {
        return args -> {

            try {
                authUseCase.register(
                        "testuser",
                        "test123"
                );
            } catch (Exception ignored) {
                throw new UserException("User already exists");
            }
        };
    }
}
