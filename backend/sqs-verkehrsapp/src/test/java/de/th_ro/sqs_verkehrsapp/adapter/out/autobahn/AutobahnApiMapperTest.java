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
    void mapWarningsShouldMapWarningEvent() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Warning title",
                "Warning subtitle",
                List.of("Line 1", "Line 2"),
                coordinate("50.123", "8.456")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        List<RoadEvent> result = mapper.mapWarnings("A1", response);

        assertThat(result)
                .singleElement()
                .satisfies(event -> {
                    assertThat(event.id()).isEqualTo("w1");
                    assertThat(event.roadId()).isEqualTo("A1");
                    assertThat(event.title()).isEqualTo("Warning title");
                    assertThat(event.subtitle()).isEqualTo("Warning subtitle");
                    assertThat(event.description()).isEqualTo("Line 1\nLine 2");
                    assertThat(event.type()).isEqualTo(RoadEventType.WARNING);
                    assertThat(event.coordinate().latitude()).isEqualTo(50.123);
                    assertThat(event.coordinate().longitude()).isEqualTo(8.456);
                    assertThat(event.riskLevel()).isEqualTo(RiskLevel.MEDIUM);
                });
    }

    @Test
    void mapRoadworksShouldMapRoadworkEvent() {
        AutobahnEventDto dto = eventDto(
                "r1",
                "Roadwork title",
                "Roadwork subtitle",
                List.of("Construction"),
                coordinate("51.0", "9.0")
        );

        RoadworksResponse response = new RoadworksResponse();
        response.setRoadworks(List.of(dto));

        List<RoadEvent> result = mapper.mapRoadworks("A2", response);

        assertThat(result)
                .singleElement()
                .satisfies(event -> {
                    assertThat(event.id()).isEqualTo("r1");
                    assertThat(event.roadId()).isEqualTo("A2");
                    assertThat(event.title()).isEqualTo("Roadwork title");
                    assertThat(event.subtitle()).isEqualTo("Roadwork subtitle");
                    assertThat(event.description()).isEqualTo("Construction");
                    assertThat(event.type()).isEqualTo(RoadEventType.ROADWORK);
                    assertThat(event.coordinate().latitude()).isEqualTo(51.0);
                    assertThat(event.coordinate().longitude()).isEqualTo(9.0);
                    assertThat(event.riskLevel()).isEqualTo(RiskLevel.LOW);
                });
    }

    @Test
    void mapClosuresShouldMapClosureEvent() {
        AutobahnEventDto dto = eventDto(
                "c1",
                "Closure title",
                "Closure subtitle",
                List.of("Closed"),
                coordinate("52.0", "10.0")
        );

        ClosureResponse response = new ClosureResponse();
        response.setClosures(List.of(dto));

        List<RoadEvent> result = mapper.mapClosures("A3", response);

        assertThat(result)
                .singleElement()
                .satisfies(event -> {
                    assertThat(event.id()).isEqualTo("c1");
                    assertThat(event.roadId()).isEqualTo("A3");
                    assertThat(event.title()).isEqualTo("Closure title");
                    assertThat(event.subtitle()).isEqualTo("Closure subtitle");
                    assertThat(event.description()).isEqualTo("Closed");
                    assertThat(event.type()).isEqualTo(RoadEventType.CLOSURE);
                    assertThat(event.coordinate().latitude()).isEqualTo(52.0);
                    assertThat(event.coordinate().longitude()).isEqualTo(10.0);
                    assertThat(event.riskLevel()).isEqualTo(RiskLevel.HIGH);
                });
    }

    @Test
    void mapWarningsShouldReturnEmptyListWhenResponseIsNull() {
        assertThat(mapper.mapWarnings("A1", null)).isEmpty();
    }

    @Test
    void mapRoadworksShouldReturnEmptyListWhenResponseIsNull() {
        assertThat(mapper.mapRoadworks("A1", null)).isEmpty();
    }

    @Test
    void mapClosuresShouldReturnEmptyListWhenResponseIsNull() {
        assertThat(mapper.mapClosures("A1", null)).isEmpty();
    }

    @Test
    void mapWarningsShouldReturnEmptyListWhenWarningsAreNull() {
        WarningResponse response = new WarningResponse();

        assertThat(mapper.mapWarnings("A1", response)).isEmpty();
    }

    @Test
    void mapRoadworksShouldReturnEmptyListWhenRoadworksAreNull() {
        RoadworksResponse response = new RoadworksResponse();

        assertThat(mapper.mapRoadworks("A1", response)).isEmpty();
    }

    @Test
    void mapClosuresShouldReturnEmptyListWhenClosuresAreNull() {
        ClosureResponse response = new ClosureResponse();

        assertThat(mapper.mapClosures("A1", response)).isEmpty();
    }

    @Test
    void mapWarningsShouldReturnEmptyListWhenWarningsAreEmpty() {
        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of());

        assertThat(mapper.mapWarnings("A1", response)).isEmpty();
    }

    @Test
    void mapRoadworksShouldReturnEmptyListWhenRoadworksAreEmpty() {
        RoadworksResponse response = new RoadworksResponse();
        response.setRoadworks(List.of());

        assertThat(mapper.mapRoadworks("A1", response)).isEmpty();
    }

    @Test
    void mapClosuresShouldReturnEmptyListWhenClosuresAreEmpty() {
        ClosureResponse response = new ClosureResponse();
        response.setClosures(List.of());

        assertThat(mapper.mapClosures("A1", response)).isEmpty();
    }

    @Test
    void mapWarningsShouldMapMultipleEvents() {
        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(
                eventDto("w1", "Title 1", "Subtitle 1", List.of("Description 1"), coordinate("50.0", "8.0")),
                eventDto("w2", "Title 2", "Subtitle 2", List.of("Description 2"), coordinate("51.0", "9.0"))
        ));

        List<RoadEvent> result = mapper.mapWarnings("A1", response);

        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting(RoadEvent::id)
                .containsExactly("w1", "w2");
        assertThat(result)
                .extracting(RoadEvent::type)
                .containsOnly(RoadEventType.WARNING);
    }

    @Test
    void mapWarningsShouldUseZeroCoordinateWhenCoordinateIsNull() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                null
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void mapWarningsShouldUseZeroCoordinateWhenLatitudeIsNull() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate(null, "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void mapWarningsShouldUseZeroCoordinateWhenLongitudeIsNull() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("50.0", null)
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void mapWarningsShouldUseZeroCoordinateWhenLatitudeIsBlank() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("   ", "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void mapWarningsShouldUseZeroCoordinateWhenLongitudeIsBlank() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("50.0", "   ")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isZero();
        assertThat(event.coordinate().longitude()).isZero();
    }

    @Test
    void mapWarningsShouldSupportCommaBasedDecimalCoordinates() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("50,123", "8,456")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.coordinate().latitude()).isEqualTo(50.123);
        assertThat(event.coordinate().longitude()).isEqualTo(8.456);
    }

    @Test
    void mapWarningsShouldMapNullDescriptionToEmptyString() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                null,
                coordinate("50.0", "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.description()).isEmpty();
    }

    @Test
    void mapWarningsShouldMapEmptyDescriptionListToEmptyString() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of(),
                coordinate("50.0", "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.description()).isEmpty();
    }

    @Test
    void mapWarningsShouldKeepNullTextFields() {
        AutobahnEventDto dto = eventDto(
                "w1",
                null,
                null,
                List.of("Description"),
                coordinate("50.0", "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        RoadEvent event = mapper.mapWarnings("A1", response).get(0);

        assertThat(event.title()).isNull();
        assertThat(event.subtitle()).isNull();
    }

    @Test
    void mapWarningsShouldThrowExceptionWhenLatitudeIsInvalid() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("invalid-lat", "8.0")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        assertThatThrownBy(() -> mapper.mapWarnings("A1", response))
                .isInstanceOf(NumberFormatException.class);
    }

    @Test
    void mapWarningsShouldThrowExceptionWhenLongitudeIsInvalid() {
        AutobahnEventDto dto = eventDto(
                "w1",
                "Title",
                "Subtitle",
                List.of("Description"),
                coordinate("50.0", "invalid-long")
        );

        WarningResponse response = new WarningResponse();
        response.setWarnings(List.of(dto));

        assertThatThrownBy(() -> mapper.mapWarnings("A1", response))
                .isInstanceOf(NumberFormatException.class);
    }

    private AutobahnEventDto eventDto(
            String identifier,
            String title,
            String subtitle,
            List<String> description,
            CoordinateDto coordinate
    ) {
        AutobahnEventDto dto = new AutobahnEventDto();
        dto.setIdentifier(identifier);
        dto.setTitle(title);
        dto.setSubtitle(subtitle);
        dto.setDescription(description);
        dto.setCoordinate(coordinate);
        return dto;
    }

    private CoordinateDto coordinate(String lat, String lon) {
        CoordinateDto coordinate = new CoordinateDto();
        coordinate.setLat(lat);
        coordinate.setLongValue(lon);
        return coordinate;
    }
}
