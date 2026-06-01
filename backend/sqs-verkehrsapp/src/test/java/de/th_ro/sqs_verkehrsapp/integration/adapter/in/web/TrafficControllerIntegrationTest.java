package de.th_ro.sqs_verkehrsapp.integration.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.adapter.in.web.TrafficController;
import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.*;
import de.th_ro.sqs_verkehrsapp.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(
        controllers = TrafficController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class
        )
)
@AutoConfigureMockMvc(addFilters = false)
public class TrafficControllerIntegrationTest {


    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrafficQueryUseCase trafficQueryUseCase;

    @Test
    void shouldReturnTrafficEvents() throws Exception {
        List<RoadEvent> events = List.of(
                event("w1", "A1", RoadEventType.WARNING, RiskLevel.MEDIUM),
                event("r1", "A1", RoadEventType.ROADWORK, RiskLevel.LOW),
                event("c1", "A1", RoadEventType.CLOSURE, RiskLevel.HIGH));

        TrafficEventsResult result = new TrafficEventsResult(
                events,
                true,
                LocalDateTime.of(2026, 5, 9, 14, 30)
        );

        when(trafficQueryUseCase.getTrafficEvents("A1"))
                .thenReturn(result);;

        mockMvc.perform(get("/api/traffic/A1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.live").value(true))
                .andExpect(jsonPath("$.cachedAt")
                        .value("2026-05-09T14:30:00"))
                .andExpect(jsonPath("$.events.length()").value(3))
                .andExpect(jsonPath("$.events[0].id").value("w1"))
                .andExpect(jsonPath("$.events[1].id").value("r1"))
                .andExpect(jsonPath("$.events[2].id").value("c1"));
    }

    @Test
    void shouldReturnAllTrafficEvents() throws Exception {
        List<RoadEvent> events = List.of(
                event("w1", "A1", RoadEventType.WARNING, RiskLevel.MEDIUM),
                event("r1", "A3", RoadEventType.ROADWORK, RiskLevel.LOW),
                event("c1", "A8", RoadEventType.CLOSURE, RiskLevel.HIGH)
        );

        TrafficEventsResult result = new TrafficEventsResult(
                events,
                true,
                LocalDateTime.of(2026, 5, 9, 15, 0)
        );

        when(trafficQueryUseCase.getAllTrafficEvents())
                .thenReturn(result);

        mockMvc.perform(get("/api/traffic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.live").value(true))
                .andExpect(jsonPath("$.cachedAt").value("2026-05-09T15:00:00"))
                .andExpect(jsonPath("$.events.length()").value(3))
                .andExpect(jsonPath("$.events[0].id").value("w1"))
                .andExpect(jsonPath("$.events[0].roadId").value("A1"))
                .andExpect(jsonPath("$.events[1].id").value("r1"))
                .andExpect(jsonPath("$.events[1].roadId").value("A3"))
                .andExpect(jsonPath("$.events[2].id").value("c1"))
                .andExpect(jsonPath("$.events[2].roadId").value("A8"));
    }

    private RoadEvent event(String id, String roadId, RoadEventType type, RiskLevel riskLevel) {
        return new RoadEvent(
                id,
                roadId,
                "Title " + id,
                "Subtitle " + id,
                "Description " + id,
                type,
                new Coordinate(50.0, 8.0),
                riskLevel
        );
    }
}
