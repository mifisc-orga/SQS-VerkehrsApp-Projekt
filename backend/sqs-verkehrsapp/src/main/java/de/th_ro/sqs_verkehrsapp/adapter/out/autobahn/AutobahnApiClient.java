package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.AutobahnRoadsResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.ClosureResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.RoadworksResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.WarningResponse;
import de.th_ro.sqs_verkehrsapp.domain.exception.ExternalTrafficApiException;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

/**
 * Client responsible for communication with the Autobahn API.
 * Retrieves warnings, roadworks, closures and available road IDs.
 */
@Component
@RequiredArgsConstructor
public class AutobahnApiClient {

    private final WebClient webClient;
    private final AutobahnApiMapper mapper;
    /**
     * Retrieves all traffic events for the given road.
     *
     * @param roadId motorway identifier, for example A3
     * @return combined list of warnings, roadworks and closures
     */
    public List<RoadEvent> fetchTrafficEvents(String roadId) {
        try {
            List<RoadEvent> events = new ArrayList<>();

            events.addAll(fetchWarnings(roadId));
            events.addAll(fetchRoadworks(roadId));
            events.addAll(fetchClosures(roadId));
            return events;

        } catch (WebClientException | IllegalStateException exception) {
            throw new ExternalTrafficApiException(
                    "Fehler beim Abrufen der Autobahn-API für " + roadId,
                    exception
            );
        }
    }

    /**
     * Retrieves roadworks for the given road.
     *
     * @param roadId motorway identifier
     * @return mapped roadwork events
     */
    public List<RoadEvent> fetchRoadworks(String roadId) {
        RoadworksResponse roadworksResponse = webClient.get()
                .uri("/{roadId}/services/roadworks", roadId)
                .retrieve()
                .bodyToMono(RoadworksResponse.class)
                .block();

        return mapper.mapRoadworks(roadId, roadworksResponse);
    }

    /**
     * Retrieves warnings for the given road.
     *
     * @param roadId motorway identifier
     * @return mapped warning events
     */
    public List<RoadEvent> fetchWarnings(String roadId) {
        WarningResponse warningResponse = webClient.get()
                .uri("/{roadId}/services/warning", roadId)
                .retrieve()
                .bodyToMono(WarningResponse.class)
                .block();
        return mapper.mapWarnings(roadId, warningResponse);
    }

    /**
     * Retrieves closures for the given road.
     *
     * @param roadId motorway identifier
     * @return mapped closure events
     */
    public List<RoadEvent> fetchClosures(String roadId) {

        ClosureResponse closureResponse = webClient.get()
                .uri("/{roadId}/services/closure", roadId)
                .retrieve()
                .bodyToMono(ClosureResponse.class)
                .block();
        return mapper.mapClosures(roadId, closureResponse);
    }

    /**
     * Retrieves all motorway identifiers available from the Autobahn API.
     *
     * @return list of available road IDs
     */
    public List<String> getAvailableRoadIds() {
        try {
            AutobahnRoadsResponse response = webClient.get()
                    .uri("/")
                    .retrieve()
                    .bodyToMono(AutobahnRoadsResponse.class)
                    .block();

            if (response == null || response.roads() == null) {
                return List.of();
            }

            return response.roads();

        } catch (WebClientException | IllegalStateException exception) {
            throw new ExternalTrafficApiException(
                    "Fehler beim Abrufen der verfügbaren Autobahnen",
                    exception
            );
        }
    }
}
