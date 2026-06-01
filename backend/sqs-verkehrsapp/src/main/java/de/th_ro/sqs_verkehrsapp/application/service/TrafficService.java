package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.logic.RiskScoreCalculator;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrafficService implements TrafficQueryUseCase {

    private final AutobahnApiPort autobahnApiPort;
    private final RiskScoreCalculator riskScoreCalculator;

    public TrafficService(AutobahnApiPort autobahnApiPort) {
        this.autobahnApiPort = autobahnApiPort;
        this.riskScoreCalculator = new RiskScoreCalculator();
    }

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

    @Override
    public TrafficEventsResult getAllTrafficEvents() {

        List<String> roadIds = autobahnApiPort.getAvailableRoadIds();

        List<RoadEvent> events = roadIds.stream()
                .flatMap(roadId -> autobahnApiPort.getTrafficEvents(roadId).events().stream())
                .toList();


        int riskScore = riskScoreCalculator.calculateRiskScore(events);

        return new TrafficEventsResult(events, true, LocalDateTime.now(), riskScore);
    }
}
