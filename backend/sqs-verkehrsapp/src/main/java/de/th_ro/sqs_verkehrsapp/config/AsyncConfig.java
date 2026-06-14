package de.th_ro.sqs_verkehrsapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Spring configuration for asynchronous processing of background tasks,
 * such as cache updates and other non-blocking operations.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
}
