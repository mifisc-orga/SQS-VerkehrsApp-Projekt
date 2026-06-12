package de.th_ro.sqs_verkehrsapp;

import org.springframework.boot.SpringApplication;

/**
 * Test application entry point used for integration tests.
 * <p>
 * This class starts the application with the
 * {@link TestcontainersConfiguration} to provide containerized
 * infrastructure components such as the database during test execution.
 */
public class TestSqsVerkehrsappApplication {

	/**
	 * Main method that starts the test application context
	 * with Testcontainers support.
	 *
	 * @param args command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.from(SqsVerkehrsappApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
