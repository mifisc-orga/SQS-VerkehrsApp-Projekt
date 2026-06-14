package de.th_ro.sqs_verkehrsapp.config;

import de.th_ro.sqs_verkehrsapp.domain.logic.RiskScoreCalculator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for domain-specific beans.
 * <p>
 * Provides domain services and components required by the application.
 */
@Configuration
public class DomainConfig {

    /**
     * Creates a {@link RiskScoreCalculator} bean.
     *
     * @return a risk score calculator instance
     */
    @Bean
    public RiskScoreCalculator riskScoreCalculator() {
        return new RiskScoreCalculator();
    }
}
