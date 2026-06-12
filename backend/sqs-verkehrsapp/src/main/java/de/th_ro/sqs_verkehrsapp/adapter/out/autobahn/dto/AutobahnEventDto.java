package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Represents a traffic event returned by the Autobahn API.
 * Contains the common fields shared by warnings, roadworks and closures.
 */
@Getter
@Setter
public class AutobahnEventDto {
    private String identifier;
    private String title;
    private String subtitle;
    private List<String> description;
    private CoordinateDto coordinate;
}
