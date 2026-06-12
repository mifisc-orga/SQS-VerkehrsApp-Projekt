package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.AutobahnEventDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Response wrapper containing road roadwork events returned by the
 * Autobahn API.
 */
@Getter
@Setter
public class RoadworksResponse {

    /**
     * List of road roadwork events.
     */
    @JsonProperty("roadworks")
    private List<AutobahnEventDto> roadworks;
}
