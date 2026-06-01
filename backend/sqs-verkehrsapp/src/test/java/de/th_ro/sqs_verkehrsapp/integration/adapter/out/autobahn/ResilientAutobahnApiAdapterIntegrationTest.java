package de.th_ro.sqs_verkehrsapp.integration.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.AutobahnApiClient;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.ResilientAutobahnApiAdapter;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class ResilientAutobahnApiAdapterIntegrationTest {

    @MockitoBean
    private AutobahnApiClient autobahnApiClient;

    @MockitoBean
    private RoadEventCachePort cachePort;

    @Autowired
    private ResilientAutobahnApiAdapter adapter;

    @Test
    void getTrafficEvents_whenApiFails_shouldUseFallbackFromCache() {
        String roadId = "A1";

        RoadEvent cachedEvent = mock(RoadEvent.class);

        TrafficEventsResult cachedResult = new TrafficEventsResult(
                List.of(cachedEvent),
                false,
                LocalDateTime.of(2026, 5, 9, 14, 30),
                0
        );
        List<RoadEvent> cachedEvents = List.of(cachedEvent);

        when(autobahnApiClient.fetchTrafficEvents(roadId))
                .thenThrow(new RuntimeException("API down"));

        when(cachePort.findByRoadId(roadId))
                .thenReturn(cachedResult);

        TrafficEventsResult result = adapter.getTrafficEvents(roadId);

        assertThat(result).isEqualTo(cachedResult);
        assertThat(result.live()).isFalse();
        assertThat(result.events()).containsExactly(cachedEvent);
        assertThat(result.cachedAt())
                .isEqualTo(LocalDateTime.of(2026, 5, 9, 14, 30));
        assertThat(result.riskScore()).isEqualTo(0);
        verify(autobahnApiClient, atLeastOnce()).fetchTrafficEvents(roadId);
        verify(cachePort).findByRoadId(roadId);
        verify(cachePort, never()).save(anyString(), anyList());
    }
}
