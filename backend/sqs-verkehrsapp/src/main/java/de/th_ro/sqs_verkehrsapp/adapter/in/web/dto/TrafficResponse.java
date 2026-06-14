package de.th_ro.sqs_verkehrsapp.adapter.in.web.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response containing traffic information and metadata about the data source.
 *
 * @param live indicates whether the traffic data was retrieved live or from cache
 * @param cachedAt the timestamp when the cached data was created, or {@code null} for live data
 * @param events the list of traffic events included in the response
 * @param riskScore the aggregated risk score calculated from the traffic events
 */
public record TrafficResponse(boolean live,
                              LocalDateTime cachedAt,
                              List<TrafficResponseDto> events,
                              int riskScore) {
}
