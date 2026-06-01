package de.th_ro.sqs_verkehrsapp.config;

import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.domain.exception.UserException;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

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
