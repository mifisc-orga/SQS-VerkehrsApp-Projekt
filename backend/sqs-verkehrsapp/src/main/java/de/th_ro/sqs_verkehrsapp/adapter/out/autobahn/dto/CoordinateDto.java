package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a geographic coordinate returned by the Autobahn API.
 */
@Getter
@Setter
public class CoordinateDto {

    private String lat;

    @JsonProperty("long")
    private String longValue;
}
