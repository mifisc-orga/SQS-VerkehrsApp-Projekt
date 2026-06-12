package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.AutobahnEventDto;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.CoordinateDto;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.ClosureResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.RoadworksResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.WarningResponse;
import de.th_ro.sqs_verkehrsapp.domain.logic.RiskScoreCalculator;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Maps Autobahn API response DTOs to domain road events.
 */
@Component
@RequiredArgsConstructor
public class AutobahnApiMapper {

    private final RiskScoreCalculator riskScoreCalculator;

    /**
     * Maps warning response data to warning road events.
     *
     * @param roadId motorway identifier
     * @param response warning response from the Autobahn API
     * @return mapped warning road events
     */
    public List<RoadEvent> mapWarnings(String roadId, WarningResponse response) {
        if (response == null || response.getWarnings() == null) {
            return Collections.emptyList();
        }

        return mapEvents(response.getWarnings(), roadId, RoadEventType.WARNING);
    }

    /**
     * Maps roadwork response data to roadwork road events.
     *
     * @param roadId motorway identifier
     * @param response roadwork response from the Autobahn API
     * @return mapped roadwork road events
     */
    public List<RoadEvent> mapRoadworks(String roadId, RoadworksResponse response) {
        if (response == null || response.getRoadworks() == null) {
            return Collections.emptyList();
        }

        return mapEvents(response.getRoadworks(), roadId, RoadEventType.ROADWORK);
    }

    /**
     * Maps closure response data to closure road events.
     *
     * @param roadId motorway identifier
     * @param response closure response from the Autobahn API
     * @return mapped closure road events
     */
    public List<RoadEvent> mapClosures(String roadId, ClosureResponse response) {
        if (response == null || response.getClosures() == null) {
            return Collections.emptyList();
        }

        return mapEvents(response.getClosures(), roadId, RoadEventType.CLOSURE);
    }

    /**
     * Maps a list of Autobahn event DTOs to road events of the given type.
     */
    private List<RoadEvent> mapEvents(
            List<AutobahnEventDto> dtos,
            String roadId,
            RoadEventType type
    ) {
        return dtos.stream()
                .map(dto -> map(dto, roadId, type))
                .toList();
    }

    /**
     * Maps a single Autobahn event DTO to a domain road event.
     */
    private RoadEvent map(AutobahnEventDto dto, String roadId, RoadEventType type) {
        return new RoadEvent(
                dto.getIdentifier(),
                roadId,
                dto.getTitle(),
                dto.getSubtitle(),
                String.join("\n", dto.getDescription() == null ? List.of() : dto.getDescription()),
                type,
                mapCoordinate(dto.getCoordinate()),
                riskScoreCalculator.calculateRiskLevel(type)
        );
    }

    /**
     * Maps coordinate DTO data to a domain coordinate.
     */
    private Coordinate mapCoordinate(CoordinateDto dto) {
        if (dto == null || isBlank(dto.getLat()) || isBlank(dto.getLongValue())) {
            return new Coordinate(0.0, 0.0);
        }

        return new Coordinate(
                parseCoordinate(dto.getLat()),
                parseCoordinate(dto.getLongValue())
        );
    }

    /**
     * Checks whether a string is null, empty or contains only whitespace.
     */
    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    /**
     * Parses coordinate values and supports comma-based decimal notation.
     */
    private double parseCoordinate(String value) {
        return Double.parseDouble(value.replace(",", "."));
    }
}
