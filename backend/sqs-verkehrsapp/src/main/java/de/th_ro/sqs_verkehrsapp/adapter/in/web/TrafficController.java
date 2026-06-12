package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.TrafficResponse;
import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.TrafficResponseDto;
import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller providing traffic information for roads.
 * Supports retrieving traffic events for a specific road or for all roads.
 */
@RestController
@RequestMapping("/api/traffic")
public class TrafficController {

    private final TrafficQueryUseCase trafficQueryUseCase;

    /**
     * Creates a new traffic controller.
     *
     * @param trafficQueryUseCase use case for retrieving traffic information
     */
    public TrafficController(TrafficQueryUseCase trafficQueryUseCase) {
        this.trafficQueryUseCase = trafficQueryUseCase;
    }

    /**
     * Retrieves traffic events for the specified road.
     *
     * @param roadId the identifier of the road
     * @return traffic information including events, risk score, and cache status
     */
    @GetMapping("/{roadId}")
    public TrafficResponse getTrafficEvents(@PathVariable String roadId) {

        TrafficEventsResult result =
                trafficQueryUseCase.getTrafficEvents(roadId);

        List<TrafficResponseDto> events = result.events()
                .stream()
                .map(this::toResponseDto)
                .toList();

        return new TrafficResponse(
                result.live(),
                result.cachedAt(),
                events,
                result.riskScore()
        );
    }

    /**
     * Retrieves traffic events for all available roads.
     *
     * @return traffic information including events, risk score, and cache status
     */
    @GetMapping
    public TrafficResponse getAllTrafficEvents() {

        TrafficEventsResult result =
                trafficQueryUseCase.getAllTrafficEvents();

        List<TrafficResponseDto> events = result.events()
                .stream()
                .map(this::toResponseDto)
                .toList();

        return new TrafficResponse(
                result.live(),
                result.cachedAt(),
                events,
                result.riskScore()
        );
    }

    /**
     * Converts a domain traffic event into a response DTO.
     *
     * @param event the domain traffic event
     * @return the corresponding response DTO
     */
    private TrafficResponseDto toResponseDto(RoadEvent event) {
        return new TrafficResponseDto(
                event.id(),
                event.roadId(),
                event.title(),
                event.subtitle(),
                event.description(),
                event.type(),
                event.coordinate().latitude(),
                event.coordinate().longitude(),
                event.riskLevel()
        );
    }
}
