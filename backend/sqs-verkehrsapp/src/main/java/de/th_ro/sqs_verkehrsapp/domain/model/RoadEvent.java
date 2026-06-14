package de.th_ro.sqs_verkehrsapp.domain.model;

/**
 * Represents a traffic event on a motorway.
 *
 * @param id unique identifier of the traffic event
 * @param roadId identifier of the associated motorway
 * @param title title of the traffic event
 * @param subtitle additional information about the traffic event
 * @param description detailed description of the traffic event
 * @param type type of the traffic event
 * @param coordinate geographic location of the traffic event
 * @param riskLevel assessed risk level of the traffic event
 */
public record RoadEvent(String id, String roadId, String title, String subtitle, String description, RoadEventType type, Coordinate coordinate, RiskLevel riskLevel) {
}
