package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.domain.exception.TrafficDataUnavailableException;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import de.th_ro.sqs_verkehrsapp.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(
        controllers = {TrafficController.class, GlobalExceptionHandler.class},
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class
        ),
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class
        }
)
@AutoConfigureMockMvc(addFilters = false)
class TrafficControllerTest {

    private final MockMvc mockMvc;

    @MockitoBean
    private TrafficQueryUseCase trafficQueryUseCase;

    @Autowired
    TrafficControllerTest(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    void shouldReturnTrafficEventsForRoadId() throws Exception {
        RoadEvent event = createWarningEvent(
                "id-1", "A1", "Title", "Subtitle", "Description",
                new Coordinate(50.123, 8.456)
        );

        when(trafficQueryUseCase.getTrafficEvents("A1"))
                .thenReturn(createResult(List.of(event), true, "2026-05-09T14:30:00", 20));

        ResultActions response = mockMvc.perform(get("/api/traffic/A1"))
                .andExpect(status().isOk());

        assertTrafficResponse(response, true, "2026-05-09T14:30:00", 1, 20);
        assertEvent(response, 0, event);

        verify(trafficQueryUseCase).getTrafficEvents("A1");
    }

    @Test
    void shouldReturnEmptyArrayWhenNoTrafficEventsExist() throws Exception {
        TrafficEventsResult result = new TrafficEventsResult(
                List.of(),
                false,
                null, 0
        );

        when(trafficQueryUseCase.getTrafficEvents("A2"))
                .thenReturn(result);

        mockMvc.perform(get("/api/traffic/A2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.live").value(false))
                .andExpect(jsonPath("$.cachedAt").doesNotExist())
                .andExpect(jsonPath("$.events.length()").value(0));
    }

    @Test
    void shouldReturn503WhenTrafficDataUnavailable() throws Exception {
        when(trafficQueryUseCase.getTrafficEvents("A8"))
                .thenThrow(new TrafficDataUnavailableException(
                        "Autobahn API nicht verfügbar und keine Cache-Daten vorhanden für A8",
                        new RuntimeException()
                ));

        mockMvc.perform(get("/api/traffic/A8"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("TRAFFIC_DATA_UNAVAILABLE"))
                .andExpect(jsonPath("$.message").value(
                        "Autobahn API nicht verfügbar und keine Cache-Daten vorhanden für A8"
                ))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void shouldReturnAllTrafficEvents() throws Exception {
        RoadEvent eventA1 = createWarningEvent(
                "id-1", "A1", "Title A1", "Subtitle A1", "Description A1", new Coordinate(50.123, 8.456)
        );

        RoadEvent eventA8 = createClosure(
                "id-2", "A8", "Title A8", "Subtitle A8", "Description A8",
                new Coordinate(51.123, 9.456)
        );

        when(trafficQueryUseCase.getAllTrafficEvents())
                .thenReturn(createResult(List.of(eventA1, eventA8), true, "2026-05-09T15:00:00", 75));

        ResultActions response = mockMvc.perform(get("/api/traffic"))
                .andExpect(status().isOk());

        assertTrafficResponse(response, true, "2026-05-09T15:00:00", 2, 75);
        assertEvent(response, 0, eventA1);
        assertEvent(response, 1, eventA8);

        verify(trafficQueryUseCase).getAllTrafficEvents();
    }

    @Test
    void shouldReturnEmptyArrayWhenNoTrafficEventsExistForAllRoads() throws Exception {
        TrafficEventsResult result = new TrafficEventsResult(
                List.of(),
                false,
                null,
                0
        );

        when(trafficQueryUseCase.getAllTrafficEvents())
                .thenReturn(result);

        mockMvc.perform(get("/api/traffic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.live").value(false))
                .andExpect(jsonPath("$.cachedAt").doesNotExist())
                .andExpect(jsonPath("$.events.length()").value(0));

        verify(trafficQueryUseCase).getAllTrafficEvents();
    }

    @Test
    void shouldReturn503WhenAllTrafficDataUnavailable() throws Exception {
        when(trafficQueryUseCase.getAllTrafficEvents())
                .thenThrow(new TrafficDataUnavailableException(
                        "Autobahn API nicht verfügbar. Autobahnen konnten nicht geladen werden.",
                        new RuntimeException()
                ));

        mockMvc.perform(get("/api/traffic"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("TRAFFIC_DATA_UNAVAILABLE"))
                .andExpect(jsonPath("$.message").value(
                        "Autobahn API nicht verfügbar. Autobahnen konnten nicht geladen werden."
                ))
                .andExpect(jsonPath("$.timestamp").exists());

        verify(trafficQueryUseCase).getAllTrafficEvents();
    }

    private RoadEvent createWarningEvent(
            String id,
            String roadId,
            String title,
            String subtitle,
            String description,
            Coordinate coordinate
    ) {
        return new RoadEvent(
                id,
                roadId,
                title,
                subtitle,
                description,
                RoadEventType.WARNING,
                coordinate,
                RiskLevel.MEDIUM
        );
    }

    private RoadEvent createClosure(
            String id,
            String roadId,
            String title,
            String subtitle,
            String description,
            Coordinate coordinate
    ) {
        return new RoadEvent(
                id,
                roadId,
                title,
                subtitle,
                description,
                RoadEventType.CLOSURE,
                coordinate,
                RiskLevel.HIGH
        );
    }

    private TrafficEventsResult createResult(
            List<RoadEvent> events,
            boolean live,
            String cachedAt,
            int riskScore
    ) {
        LocalDateTime cachedAtTime = null;

        if (cachedAt != null) {
            cachedAtTime = LocalDateTime.parse(cachedAt);
        }

        return new TrafficEventsResult(events, live, cachedAtTime, riskScore);
    }

    private void assertTrafficResponse(
            ResultActions response,
            boolean live,
            String cachedAt,
            int eventCount,
            int riskScore
    ) throws Exception {
        response.andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.live").value(live))
                .andExpect(jsonPath("$.events.length()").value(eventCount))
                .andExpect(jsonPath("$.riskScore").value(riskScore));

        if (cachedAt == null) {
            response.andExpect(jsonPath("$.cachedAt").doesNotExist());
        } else {
            response.andExpect(jsonPath("$.cachedAt").value(cachedAt));
        }
    }

    private void assertEvent(
            ResultActions response,
            int index,
            RoadEvent event
    ) throws Exception {
        String path = "$.events[" + index + "]";

        response.andExpect(jsonPath(path + ".id").value(event.id()))
                .andExpect(jsonPath(path + ".roadId").value(event.roadId()))
                .andExpect(jsonPath(path + ".title").value(event.title()))
                .andExpect(jsonPath(path + ".subtitle").value(event.subtitle()))
                .andExpect(jsonPath(path + ".description").value(event.description()))
                .andExpect(jsonPath(path + ".type").value(event.type().name()))
                .andExpect(jsonPath(path + ".latitude").value(event.coordinate().latitude()))
                .andExpect(jsonPath(path + ".longitude").value(event.coordinate().longitude()))
                .andExpect(jsonPath(path + ".riskLevel").value(event.riskLevel().name()));
    }
}
