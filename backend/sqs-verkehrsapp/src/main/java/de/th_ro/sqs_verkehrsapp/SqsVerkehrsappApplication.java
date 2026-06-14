package de.th_ro.sqs_verkehrsapp;

import de.th_ro.sqs_verkehrsapp.config.AutobahnApiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Main entry point of the SQS Traffic Application.
 * <p>
 * Bootstraps the Spring Boot application and enables
 * configuration properties required by the application.
 */
@SpringBootApplication
@EnableConfigurationProperties(AutobahnApiProperties.class)
public class SqsVerkehrsappApplication {

	/**
	 * Main method that starts the Spring Boot application.
	 *
	 * @param args command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(SqsVerkehrsappApplication.class, args);
	}

}
