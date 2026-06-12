package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.AutobahnEventDto;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.CoordinateDto;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.ClosureResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.RoadworksResponse;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper.WarningResponse;
import de.th_ro.sqs_verkehrsapp.domain.logic.RiskScoreCalculator;
import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AutobahnApiMapperTest {

    private final AutobahnApiMapper mapper =
            new AutobahnApiMapper(new RiskScoreCalculator());

    @Test
    void shouldMapWarnings() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("w1");
        dto.setTitle("Warning title");
        dto.setSubtitle("Warning subtitle");
        dto.setDescription(List.of("Line 1", "Line 2"));
        dto.setCoordinate(coordinate("50.123", "8.456"));

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        List<RoadEvent> result = mapper.mapWarnings("A1", response);

        assertThat(result).hasSize(1);

        RoadEvent event = result.getFirst();

        assertThat(event.id()).isEqualTo("w1");
        assertThat(event.roadId()).isEqualTo("A1");
        assertThat(event.title()).isEqualTo("Warning title");
        assertThat(event.subtitle()).isEqualTo("Warning subtitle");
        assertThat(event.description()).isEqualTo("Line 1\nLine 2");
        assertThat(event.type()).isEqualTo(RoadEventType.WARNING);
        assertThat(event.coordinate().latitude()).isEqualTo(50.123);
        assertThat(event.coordinate().longitude()).isEqualTo(8.456);
        assertThat(event.riskLevel()).isEqualTo(RiskLevel.MEDIUM);
    }

    @Test
    void shouldMapRoadworks() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("r1");
        dto.setTitle("Roadwork title");
        dto.setSubtitle("Roadwork subtitle");
        dto.setDescription(List.of("Construction"));
        dto.setCoordinate(coordinate("51.0", "9.0"));

        RoadworksResponse response = new RoadworksResponse();
        response.setRoadworks(List.of(dto));

        List<RoadEvent> result = mapper.mapRoadworks("A2", response);

        assertThat(result)
                .singleElement()
                .satisfies(event -> {
                    assertThat(event.id()).isEqualTo("r1");
                    assertThat(event.roadId()).isEqualTo("A2");
                    assertThat(event.type()).isEqualTo(RoadEventType.ROADWORK);
                    assertThat(event.riskLevel()).isEqualTo(RiskLevel.LOW);
                });
    }

    @Test
    void shouldMapClosures() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("c1");
        dto.setTitle("Closure title");
        dto.setSubtitle("Closure subtitle");
        dto.setDescription(List.of("Closed"));
        dto.setCoordinate(coordinate("52.0", "10.0"));

        ClosureResponse response = new ClosureResponse();
        response.setClosures(List.of(dto));

        List<RoadEvent> result = mapper.mapClosures("A3", response);

        assertThat(result)
                .singleElement()
                .satisfies(event -> {
                    assertThat(event.id()).isEqualTo("c1");
                    assertThat(event.type()).isEqualTo(RoadEventType.CLOSURE);
                    assertThat(event.riskLevel()).isEqualTo(RiskLevel.HIGH);
                });
    }

    @Test
    void shouldReturnEmptyListWhenResponseIsNull() {
        assertThat(mapper.mapWarnings("A1", null)).isEmpty();
        assertThat(mapper.mapRoadworks("A1", null)).isEmpty();
        assertThat(mapper.mapClosures("A1", null)).isEmpty();
    }

    @Test
    void shouldReturnEmptyListWhenResponseListsAreNull() {
        assertThat(mapper.mapWarnings("A1", new WarningResponse())).isEmpty();
        assertThat(mapper.mapRoadworks("A1", new RoadworksResponse())).isEmpty();
        assertThat(mapper.mapClosures("A1", new ClosureResponse())).isEmpty();
    }

    @Test
    void shouldUseZeroCoordinateWhenCoordinateIsNull() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("w1");
        dto.setDescription(List.of());

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).getFirst();

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void shouldMapNullDescriptionToEmptyString() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("w1");
        dto.setCoordinate(coordinate("50.0", "8.0"));

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).getFirst();

        assertThat(event.description()).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenCoordinateValuesAreInvalid() {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier("w1");
        dto.setTitle("Warning title");
        dto.setSubtitle("Warning subtitle");
        dto.setDescription(List.of("Description"));
        dto.setCoordinate(coordinate("invalid-lat", "invalid-long"));

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        assertThatThrownBy(() -> mapper.mapWarnings("A1", response))
                .isInstanceOf(NumberFormatException.class);
    }

    private CoordinateDto coordinate(String lat, String lon) {
        CoordinateDto coordinate = new CoordinateDto();
        coordinate.setLat(lat);
        coordinate.setLongValue(lon);
        return coordinate;
    }
}
