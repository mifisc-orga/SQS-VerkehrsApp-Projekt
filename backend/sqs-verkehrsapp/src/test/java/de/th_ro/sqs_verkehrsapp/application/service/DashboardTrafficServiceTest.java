package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoadTrafficResult;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DashboardTrafficServiceTest {

    @Mock
    private SavedRoadPort savedRoadPort;

    @Mock
    private TrafficService trafficService;

    @InjectMocks
    private DashboardTrafficService dashboardTrafficService;

    @Test
    public void shouldGetTrafficForSavedRoads() {
        UUID userId = UUID.randomUUID();

        SavedRoad a8 = SavedRoad.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A8")
                .build();

        SavedRoad a3 = SavedRoad.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A3")
                .build();

        TrafficEventsResult a8Result =
                new TrafficEventsResult(List.of(), true, LocalDateTime.now());

        TrafficEventsResult a3Result =
                new TrafficEventsResult(List.of(), true, LocalDateTime.now());

        when(savedRoadPort.findByUserId(userId))
                .thenReturn(List.of(a8, a3));

        when(trafficService.getTrafficEvents("A8")).thenReturn(a8Result);
        when(trafficService.getTrafficEvents("A3")).thenReturn(a3Result);

        List<SavedRoadTrafficResult> result =
                dashboardTrafficService.getTrafficForSavedRoads(userId);

        assertThat(result).hasSize(2);

        assertThat(result.get(0).roadId()).isEqualTo("A8");
        assertThat(result.get(0).trafficEvents()).isEqualTo(a8Result);

        assertThat(result.get(1).roadId()).isEqualTo("A3");
        assertThat(result.get(1).trafficEvents()).isEqualTo(a3Result);

        verify(trafficService).getTrafficEvents("A8");
        verify(trafficService).getTrafficEvents("A3");
    }

}