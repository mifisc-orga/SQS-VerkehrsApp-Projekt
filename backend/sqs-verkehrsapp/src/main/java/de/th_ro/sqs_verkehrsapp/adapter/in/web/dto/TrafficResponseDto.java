package de.th_ro.sqs_verkehrsapp.adapter.in.web.dto;

import de.th_ro.sqs_verkehrsapp.domain.model.RiskLevel;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;

/**
 * DTO representing a traffic event exposed through the REST API.
 *
 * @param id the unique identifier of the traffic event
 * @param roadId the identifier of the affected road
 * @param title the title of the traffic event
 * @param subtitle additional short information about the traffic event
 * @param description a detailed description of the traffic event
 * @param type the type of the traffic event
 * @param latitude the latitude of the event location
 * @param longitude the longitude of the event location
 * @param riskLevel the calculated risk level of the event
 */
public record TrafficResponseDto(String id,
                                 String roadId,
                                 String title,
                                 String subtitle,
                                 String description,
                                 RoadEventType type,
                                 double latitude,
                                 double longitude,
                                 RiskLevel riskLevel) {
}
