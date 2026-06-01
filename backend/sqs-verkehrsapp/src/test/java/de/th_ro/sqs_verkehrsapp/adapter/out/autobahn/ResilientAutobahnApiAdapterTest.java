package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.exception.TrafficDataUnavailableException;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResilientAutobahnApiAdapterTest {

    @Mock
    private AutobahnApiClient autobahnApiClient;

    @Mock
    private RoadEventCachePort cachePort;

    @InjectMocks
    private ResilientAutobahnApiAdapter adapter;

    @Test
    void getTrafficEvents_shouldReturnLiveEventsAndSaveToCache() {
        RoadEvent event = new RoadEvent(
                "id-1",
                "A1",
                "Live Event",
                "Live",
                "",
                RoadEventType.WARNING,
                new Coordinate(52.1, 13.4),
                null
        );

        when(autobahnApiClient.fetchTrafficEvents("A1"))
                .thenReturn(List.of(event));

        TrafficEventsResult result = adapter.getTrafficEvents("A1");

        assertThat(result.events()).containsExactly(event);
        assertThat(result.live()).isTrue();
        assertThat(result.cachedAt()).isNotNull();
        assertThat(result.riskScore()).isEqualTo(0);

        verify(cachePort).save("A1", List.of(event));
    }

    @Test
    void getTrafficEventsFallback_shouldReturnCachedEvents() {
        RoadEvent cachedEvent = new RoadEvent(
                "cached-1",
                "A1",
                "Cached Event",
                "Aus Cache geladen",
                "",
                RoadEventType.WARNING,
                new Coordinate(52.1, 13.4),
                null
        );

        TrafficEventsResult cachedResult = new TrafficEventsResult(
                List.of(cachedEvent),
                false,
                LocalDateTime.of(2026, 5, 9, 14, 30),
                0
        );

        when(cachePort.findByRoadId("A1"))
                .thenReturn(cachedResult);

        TrafficEventsResult result =
                adapter.getTrafficEventsFallback("A1", new RuntimeException("API down"));

        assertThat(result).isEqualTo(cachedResult);
        assertThat(result.live()).isFalse();
        assertThat(result.events()).containsExactly(cachedEvent);
        assertThat(result.riskScore()).isEqualTo(0);

        verify(cachePort).findByRoadId("A1");
        verifyNoInteractions(autobahnApiClient);
    }

    @Test
    void shouldThrowExceptionWhenApiFailsAndCacheIsEmpty() {
        String roadId = "A8";

        when(cachePort.findByRoadId(roadId))
                .thenReturn(null);

        assertThrows(
                TrafficDataUnavailableException.class,
                () -> adapter.getTrafficEventsFallback(
                        roadId,
                        new RuntimeException("API nicht verfügbar")
                )
        );
    }

    @Test
    void getAvailableRoadIds_shouldReturnRoadIdsFromClient() {
        when(autobahnApiClient.getAvailableRoadIds())
                .thenReturn(List.of("A1", "A3", "A8"));

        List<String> result = adapter.getAvailableRoadIds();

        assertThat(result).containsExactly("A1", "A3", "A8");

        verify(autobahnApiClient).getAvailableRoadIds();
        verifyNoInteractions(cachePort);
    }

    @Test
    void getAvailableRoadIdsFallback_shouldThrowTrafficDataUnavailableException() {
        TrafficDataUnavailableException exception = assertThrows(
                TrafficDataUnavailableException.class,
                () -> adapter.getAvailableRoadIdsFallback(
                        new RuntimeException("API down")
                )
        );

        assertThat(exception.getMessage())
                .contains("Autobahn API nicht verfügbar");
    }
}
