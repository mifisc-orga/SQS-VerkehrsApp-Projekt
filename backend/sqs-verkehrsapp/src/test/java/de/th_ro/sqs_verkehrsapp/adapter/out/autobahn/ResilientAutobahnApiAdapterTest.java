package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
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

    @Mock
    private AvailableRoadCachePort availableRoadCachePort;

    @Mock
    private AutobahnCacheWriter autobahnCacheWriter;

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

        verify(autobahnCacheWriter).saveTrafficEvents("A1", List.of(event));
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
    void getAvailableRoadIds_shouldReturnRoadIdsFromClientAndSaveToCache() {
        List<String> roadIds = List.of("A1", "A3", "A8");

        when(autobahnApiClient.getAvailableRoadIds())
                .thenReturn(roadIds);

        List<String> result = adapter.getAvailableRoadIds();

        assertThat(result).containsExactly("A1", "A3", "A8");

        verify(autobahnApiClient).getAvailableRoadIds();
        verify(autobahnCacheWriter).saveAvailableRoadIds(roadIds);
        verifyNoInteractions(cachePort);
    }

    @Test
    void getAvailableRoadIds_shouldNotSaveEmptyRoadIdsToCache() {
        when(autobahnApiClient.getAvailableRoadIds())
                .thenReturn(List.of());

        List<String> result = adapter.getAvailableRoadIds();

        assertThat(result).isEmpty();

        verify(autobahnApiClient).getAvailableRoadIds();
        verify(availableRoadCachePort, never()).saveAll(anyList());
        verifyNoInteractions(cachePort);
    }

    @Test
    void getAvailableRoadIdsFallback_shouldReturnCachedRoadIds() {
        List<String> cachedRoadIds = List.of("A1", "A3", "A8");

        when(availableRoadCachePort.findAll())
                .thenReturn(cachedRoadIds);

        List<String> result = adapter.getAvailableRoadIdsFallback(
                new RuntimeException("API down")
        );

        assertThat(result).containsExactly("A1", "A3", "A8");

        verify(availableRoadCachePort).findAll();
        verifyNoInteractions(autobahnApiClient);
        verifyNoInteractions(cachePort);
    }

    @Test
    void getAvailableRoadIdsFallback_shouldThrowTrafficDataUnavailableExceptionWhenCacheIsEmpty() {
        when(availableRoadCachePort.findAll())
                .thenReturn(List.of());

        TrafficDataUnavailableException exception = assertThrows(
                TrafficDataUnavailableException.class,
                () -> adapter.getAvailableRoadIdsFallback(
                        new RuntimeException("API down")
                )
        );

        assertThat(exception.getMessage())
                .contains("keine gecachten Autobahnen vorhanden");

        verify(availableRoadCachePort).findAll();
    }

    @Test
    void getAllTrafficEvents_shouldReturnLiveEventsAndSaveAllToCache() {
        RoadEvent eventA1 = new RoadEvent(
                "id-1",
                "A1",
                "Event A1",
                "Live",
                "",
                RoadEventType.WARNING,
                new Coordinate(52.1, 13.4),
                null
        );

        RoadEvent eventA3 = new RoadEvent(
                "id-2",
                "A3",
                "Event A3",
                "Live",
                "",
                RoadEventType.ROADWORK,
                new Coordinate(48.1, 11.5),
                null
        );

        when(autobahnApiClient.getAvailableRoadIds())
                .thenReturn(List.of("A1", "A3"));

        when(autobahnApiClient.fetchTrafficEvents("A1"))
                .thenReturn(List.of(eventA1));

        when(autobahnApiClient.fetchTrafficEvents("A3"))
                .thenReturn(List.of(eventA3));

        TrafficEventsResult result = adapter.getAllTrafficEvents();

        assertThat(result.events()).containsExactly(eventA1, eventA3);
        assertThat(result.live()).isTrue();
        assertThat(result.cachedAt()).isNotNull();
        assertThat(result.riskScore()).isEqualTo(0);

        verify(autobahnCacheWriter).saveAvailableRoadIds(List.of("A1", "A3"));
        verify(autobahnCacheWriter).saveTrafficEvents("A1", List.of(eventA1));
        verify(autobahnCacheWriter).saveTrafficEvents("A3", List.of(eventA3));
        verify(autobahnCacheWriter).saveTrafficEvents("ALL", List.of(eventA1, eventA3));
    }

    @Test
    void getAllTrafficEventsFallback_shouldReturnCachedAllEvents() {
        RoadEvent cachedEvent = new RoadEvent(
                "cached-1",
                "A1",
                "Cached All Event",
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

        when(cachePort.findByRoadId("ALL"))
                .thenReturn(cachedResult);

        TrafficEventsResult result = adapter.getAllTrafficEventsFallback(
                new RuntimeException("API down")
        );

        assertThat(result.events()).containsExactly(cachedEvent);
        assertThat(result.live()).isFalse();
        assertThat(result.cachedAt()).isEqualTo(LocalDateTime.of(2026, 5, 9, 14, 30));
        assertThat(result.riskScore()).isEqualTo(0);

        verify(cachePort).findByRoadId("ALL");
        verifyNoInteractions(autobahnApiClient);
    }

    @Test
    void getAllTrafficEventsFallback_shouldThrowTrafficDataUnavailableExceptionWhenCacheIsEmpty() {
        when(cachePort.findByRoadId("ALL"))
                .thenReturn(new TrafficEventsResult(
                        List.of(),
                        false,
                        null,
                        0
                ));

        TrafficDataUnavailableException exception = assertThrows(
                TrafficDataUnavailableException.class,
                () -> adapter.getAllTrafficEventsFallback(
                        new RuntimeException("API down")
                )
        );

        assertThat(exception.getMessage())
                .contains("keine Cache-Daten für alle Verkehrsmeldungen");

        verify(cachePort).findByRoadId("ALL");
    }
}
