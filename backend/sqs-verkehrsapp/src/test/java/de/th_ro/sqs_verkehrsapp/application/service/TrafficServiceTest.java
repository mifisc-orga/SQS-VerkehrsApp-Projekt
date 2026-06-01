package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.model.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrafficServiceTest {
    @Mock
    private AutobahnApiPort autobahnApiPort;

    @InjectMocks
    private TrafficService trafficService;

    @Test
    void shouldReturnAllTrafficEventsInExpectedOrder() {
        String roadId = "A1";

        RoadEvent warning = event("1", roadId, RoadEventType.WARNING);
        RoadEvent roadwork = event("2", roadId, RoadEventType.ROADWORK);
        RoadEvent closure = event("3", roadId, RoadEventType.CLOSURE);
        List<RoadEvent> expectedEvents = List.of(
                warning,
                roadwork,
                closure);

        TrafficEventsResult expectedResult = new TrafficEventsResult(
                expectedEvents,
                true,
                LocalDateTime.of(2026, 5, 9, 14, 30),
                0
        );

        when(autobahnApiPort.getTrafficEvents(roadId))
                .thenReturn(expectedResult);

        TrafficEventsResult result = trafficService.getTrafficEvents(roadId);

        assertThat(result.events()).containsExactlyElementsOf(expectedEvents);
        assertThat(result.live()).isTrue();
        assertThat(result.cachedAt())
                .isEqualTo(LocalDateTime.of(2026, 5, 9, 14, 30));
        assertThat(result.riskScore()).isEqualTo(57);
        verify(autobahnApiPort).getTrafficEvents(roadId);
    }

    @Test
    void shouldReturnEmptyListWhenNoEventsExist() {
        String roadId = "A2";

        TrafficEventsResult emptyResult = new TrafficEventsResult(
                List.of(),
                false,
                null,
                0
        );

        when(autobahnApiPort.getTrafficEvents(roadId))
                .thenReturn(emptyResult);

        TrafficEventsResult result = trafficService.getTrafficEvents(roadId);

        assertThat(result.events()).isEmpty();
        assertThat(result.live()).isFalse();
        assertThat(result.cachedAt()).isNull();
        assertThat(result.riskScore()).isEqualTo(0);

        verify(autobahnApiPort).getTrafficEvents(roadId);
    }

    private RoadEvent event(String id, String roadId, RoadEventType type) {
        return new RoadEvent(
                id,
                roadId,
                "Title",
                "Subtitle",
                "Description",
                type,
                new Coordinate(50.0, 8.0),
                RiskLevel.MEDIUM
        );
    }
}
