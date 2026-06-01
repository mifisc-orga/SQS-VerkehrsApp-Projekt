package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.TrafficResponse;
import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.TrafficResponseDto;
import de.th_ro.sqs_verkehrsapp.application.port.in.TrafficQueryUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
public class TrafficController {

    private final TrafficQueryUseCase trafficQueryUseCase;

    public TrafficController(TrafficQueryUseCase trafficQueryUseCase) {
        this.trafficQueryUseCase = trafficQueryUseCase;
    }

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
