package de.th_ro.sqs_verkehrsapp.adapter.in.web.dto;

import java.time.LocalDateTime;

/**
 * Standardized API error response returned when a request cannot be processed.
 *
 * @param code a machine-readable error code
 * @param message a human-readable description of the error
 * @param timestamp the time at which the error occurred
 */
public record ApiErrorResponse(String code,
                               String message,
                               LocalDateTime timestamp) {
}
