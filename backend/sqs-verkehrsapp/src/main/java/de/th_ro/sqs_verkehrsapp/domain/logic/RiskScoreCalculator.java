package de.th_ro.sqs_verkehrsapp.domain.logic;

import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;

import java.util.List;

/**
 * Calculates risk levels and risk scores for traffic events.
 * <p>
 * Provides functionality for assessing the severity of traffic events
 * and computing a normalized risk score based on their types.
 */
public class RiskScoreCalculator {

    /**
     * Determines the risk level for a given traffic event type.
     *
     * @param type the traffic event type
     * @return the corresponding risk level
     */
    public RiskLevel calculateRiskLevel(RoadEventType type) {
        return switch (type) {
            case CLOSURE -> RiskLevel.HIGH;
            case WARNING -> RiskLevel.MEDIUM;
            case ROADWORK -> RiskLevel.LOW;
        };
    }

    /**
     * Calculates a normalized risk score based on the provided traffic events.
     * <p>
     * The score is calculated as:
     * actual risk points / maximum possible risk points * 100.
     *
     * @param events the traffic events
     * @return a value between 0 and 100
     */
    public int calculateRiskScore(List<RoadEvent> events) {
        if (events == null || events.isEmpty()) {
            return 0;
        }

        int rawScore = events.stream()
                .map(RoadEvent::type)
                .mapToInt(this::riskPoints)
                .sum();

        int maxPossibleScore = events.size() * 50; // 50 = highest individual value, e.g. CLOSURE

        double normalizedScore = (rawScore / (double) maxPossibleScore) * 100;

        return (int) Math.round(normalizedScore);
    }

    /**
     * Returns the risk points associated with a traffic event type.
     *
     * @param type the traffic event type
     * @return the number of risk points assigned to the type
     */
    private int riskPoints(RoadEventType type) {
        return switch (type) {
            case CLOSURE -> 50;
            case WARNING -> 25;
            case ROADWORK -> 10;
        };
    }
}
