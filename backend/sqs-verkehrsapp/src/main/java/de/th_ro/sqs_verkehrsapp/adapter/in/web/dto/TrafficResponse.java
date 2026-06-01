package de.th_ro.sqs_verkehrsapp.adapter.in.web.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TrafficResponse(boolean live,
                              LocalDateTime cachedAt,
                              List<TrafficResponseDto> events,
                              int riskScore) {
}
