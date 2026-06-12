package de.th_ro.sqs_verkehrsapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration class for HTTP client beans.
 * <p>
 * Provides configured {@link WebClient} instances used for
 * communication with external services.
 */
@Configuration
public class WebClientConfig {

    /**
     * Creates a {@link WebClient} configured for accessing the Autobahn API.
     *
     * @param properties configuration properties for the Autobahn API
     * @return a configured WebClient instance
     */
    @Bean
    public WebClient autobahnWebClient(AutobahnApiProperties properties) {
        return WebClient.builder()
                .baseUrl(properties.getBaseUrl())
                .codecs(configurer ->
                        configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024)
                )
                .build();
    }
}
