package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.ClosureResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.RoadworksResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.WarningResponse;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutobahnApiClientTest {

    @Mock
    private AutobahnApiMapper mapper;

    private MockWebServer mockWebServer;

    private AutobahnApiClient client;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();

        client = new AutobahnApiClient(webClient, mapper);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void fetchTrafficEventsShouldFetchAndCombineAllEventTypes() {
        enqueueSuccessfulEventResponses();

        RoadEvent warning = roadEvent("warning-1", "Warnung", RoadEventType.WARNING);
        RoadEvent roadwork = roadEvent("roadwork-1", "Baustelle", RoadEventType.ROADWORK);
        RoadEvent closure = roadEvent("closure-1", "Sperrung", RoadEventType.CLOSURE);

        mockMappedResponses(warning, roadwork, closure);

        List<RoadEvent> result = client.fetchTrafficEvents("A1");

        assertEquals(3, result.size());
        assertThat(result).containsExactlyInAnyOrder(warning, roadwork, closure);
    }

    private void enqueueSuccessfulEventResponses() {
        enqueueJsonResponse("""
            {
              "warning": []
            }
            """);

        enqueueJsonResponse("""
            {
              "roadworks": []
            }
            """);

        enqueueJsonResponse("""
            {
              "closure": []
            }
            """);
    }

    private void enqueueJsonResponse(String body) {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(body)
                .addHeader("Content-Type", "application/json"));
    }

    private RoadEvent roadEvent(String id, String title, RoadEventType type) {
        return new RoadEvent(
                id,
                "A1",
                title,
                title,
                "",
                type,
                new Coordinate(52.1, 13.4),
                null
        );
    }

    private void mockMappedResponses(
            RoadEvent warning,
            RoadEvent roadwork,
            RoadEvent closure
    ) {
        when(mapper.mapWarnings(eq("A1"), any(WarningResponse.class)))
                .thenReturn(List.of(warning));

        when(mapper.mapRoadworks(eq("A1"), any(RoadworksResponse.class)))
                .thenReturn(List.of(roadwork));

        when(mapper.mapClosures(eq("A1"), any(ClosureResponse.class)))
                .thenReturn(List.of(closure));
    }
}
