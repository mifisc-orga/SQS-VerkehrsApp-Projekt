package de.th_ro.sqs_verkehrsapp.domain.logic;

import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;

import java.util.List;

public class RiskScoreCalculator {

    private static final int MAX_SCORE = 100;

    public RiskLevel calculateRiskLevel(RoadEventType type) {
        return switch (type) {
            case CLOSURE -> RiskLevel.HIGH;
            case WARNING -> RiskLevel.MEDIUM;
            case ROADWORK -> RiskLevel.LOW;
        };
    }

    /**
     * Methode berechnet den Risikoscore wie folgt:  Score = tatsächliche Risikopunkte / maximal mögliche Risikopunkte * 100.
     *
     * @param events Verkehrsereignisse
     * @return Wert zwischen 1 und 100
     */
    public int calculateRiskScore(List<RoadEvent> events) {
        if (events == null || events.isEmpty()) {
            return 0;
        }

        int rawScore = events.stream()
                .map(RoadEvent::type)
                .mapToInt(this::riskPoints)
                .sum();

        int maxPossibleScore = events.size() * 50; // 50 = höchster Einzelwert, z.B. CLOSURE

        double normalizedScore = (rawScore / (double) maxPossibleScore) * 100;

        return (int) Math.round(normalizedScore);
    }


    private int riskPoints(RoadEventType type) {
        return switch (type) {
            case CLOSURE -> 50;
            case WARNING -> 25;
            case ROADWORK -> 10;
        };
    }
}
