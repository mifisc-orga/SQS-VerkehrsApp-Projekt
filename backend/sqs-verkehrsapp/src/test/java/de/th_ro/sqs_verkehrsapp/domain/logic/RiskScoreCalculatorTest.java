package de.th_ro.sqs_verkehrsapp.domain.logic;

import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class RiskScoreCalculatorTest {

    private final RiskScoreCalculator riskScoreCalculator = new RiskScoreCalculator();

    @Test
    void shouldReturnHighRiskForClosure() {
        assertThat(riskScoreCalculator.calculateRiskLevel(RoadEventType.CLOSURE))
                .isEqualTo(RiskLevel.HIGH);
    }

    @Test
    void shouldReturnMediumRiskForWarning() {
        assertThat(riskScoreCalculator.calculateRiskLevel(RoadEventType.WARNING))
                .isEqualTo(RiskLevel.MEDIUM);
    }

    @Test
    void shouldReturnMediumRiskForRoadwork() {
        assertThat(riskScoreCalculator.calculateRiskLevel(RoadEventType.ROADWORK))
                .isEqualTo(RiskLevel.LOW);
    }

    @Test
    void shouldCalculateNormalizedRiskScore() {

        List<RoadEvent> events = List.of(
                event("1", RoadEventType.WARNING),
                event("2", RoadEventType.ROADWORK),
                event("3", RoadEventType.CLOSURE)
        );

        int result = riskScoreCalculator.calculateRiskScore(events);

        /*
         * WARNING  = 25
         * ROADWORK = 10
         * CLOSURE  = 50
         *
         * rawScore = 85
         * maxPossibleScore = 3 * 50 = 150
         *
         * 85 / 150 * 100 = 56.67
         * gerundet = 57
         */

        assertThat(result).isEqualTo(57);
    }

    @Test
    void shouldReturnZeroWhenEventsAreEmpty() {

        int result = riskScoreCalculator.calculateRiskScore(List.of());

        assertThat(result).isEqualTo(0);
    }

    @Test
    void shouldReturnHundredWhenAllEventsAreClosures() {

        List<RoadEvent> events = List.of(
                event("1", RoadEventType.CLOSURE),
                event("2", RoadEventType.CLOSURE),
                event("3", RoadEventType.CLOSURE)
        );

        int result = riskScoreCalculator.calculateRiskScore(events);

        assertThat(result).isEqualTo(100);
    }

    @Test
    void shouldCalculateLowRiskForOnlyRoadworks() {

        List<RoadEvent> events = List.of(
                event("1", RoadEventType.ROADWORK),
                event("2", RoadEventType.ROADWORK),
                event("3", RoadEventType.ROADWORK)
        );

        int result = riskScoreCalculator.calculateRiskScore(events);

        /*
         * rawScore = 30
         * max = 150
         *
         * 30 / 150 * 100 = 20
         */

        assertThat(result).isEqualTo(20);
    }

    private RoadEvent event(String id, RoadEventType type) {
        return new RoadEvent(
                id,
                "A1",
                "Title",
                "Subtitle",
                "Description",
                type,
                new Coordinate(50.0, 8.0),
                riskScoreCalculator.calculateRiskLevel(type)
        );
    }
}
