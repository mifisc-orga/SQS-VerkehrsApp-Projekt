package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.logic.RiskScoreCalculator;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.springframework.stereotype.Service;

/**
 * Service implementation of {@link TrafficQueryUseCase}.
 * <p>
 * Retrieves traffic events from the Autobahn API and enriches the results
 * with a calculated risk score.
 */
@Service
public class TrafficService implements TrafficQueryUseCase {

    private final AutobahnApiPort autobahnApiPort;
    private final RiskScoreCalculator riskScoreCalculator;

    /**
     * Creates a new traffic service.
     *
     * @param autobahnApiPort output port for accessing traffic data
     */
    public TrafficService(AutobahnApiPort autobahnApiPort) {
        this.autobahnApiPort = autobahnApiPort;
        this.riskScoreCalculator = new RiskScoreCalculator();
    }

    /**
     * Retrieves traffic events for a specific motorway and calculates
     * the corresponding risk score.
     *
     * @param roadId the motorway identifier
     * @return the traffic events result including the calculated risk score
     */
    @Override
    public TrafficEventsResult getTrafficEvents(String roadId) {
        TrafficEventsResult result = autobahnApiPort.getTrafficEvents(roadId);

        int riskScore = riskScoreCalculator.calculateRiskScore(result.events());

        return new TrafficEventsResult(
                result.events(),
                result.live(),
                result.cachedAt(),
                riskScore
        );
    }

    /**
     * Retrieves traffic events for all available motorways and calculates
     * the corresponding risk score.
     *
     * @return the traffic events result including the calculated risk score
     */
    @Override
    public TrafficEventsResult getAllTrafficEvents() {

        TrafficEventsResult result = autobahnApiPort.getAllTrafficEvents();

        int riskScore = riskScoreCalculator.calculateRiskScore(result.events());

        return new TrafficEventsResult(
                result.events(),
                result.live(),
                result.cachedAt(),
                riskScore
        );
    }
}
