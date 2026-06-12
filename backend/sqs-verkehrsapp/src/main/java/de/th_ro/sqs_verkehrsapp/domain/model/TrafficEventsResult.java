package de.th_ro.sqs_verkehrsapp.domain.model;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents the result of a traffic event query.
 *
 * @param events the retrieved traffic events
 * @param live indicates whether the data was retrieved live from the API
 * @param cachedAt timestamp when the data was cached, or {@code null} if the data is live
 * @param riskScore calculated risk score for the retrieved traffic events
 */
public record TrafficEventsResult(List<RoadEvent> events,
                                  boolean live,
                                  LocalDateTime cachedAt, int riskScore) {
}
