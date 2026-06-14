package de.th_ro.sqs_verkehrsapp.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for the Autobahn API integration.
 * <p>
 * Maps configuration values with the prefix {@code autobahn.api}
 * from the application configuration.
 */
@Setter
@Getter
@ConfigurationProperties(prefix = "autobahn.api")
public class AutobahnApiProperties {

    /**
     * Base URL of the Autobahn API.
     */
    private String baseUrl;

}
