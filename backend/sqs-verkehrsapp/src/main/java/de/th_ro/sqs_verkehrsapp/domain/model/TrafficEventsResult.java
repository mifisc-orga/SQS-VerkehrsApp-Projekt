package de.th_ro.sqs_verkehrsapp.domain.model;

import java.time.LocalDateTime;
import java.util.List;

public record TrafficEventsResult(List<RoadEvent> events,
                                  boolean live,
                                  LocalDateTime cachedAt, int riskScore) {
}
