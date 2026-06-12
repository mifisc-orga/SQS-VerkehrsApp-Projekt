package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.ApiErrorResponse;
import de.th_ro.sqs_verkehrsapp.domain.exception.TrafficDataUnavailableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Global exception handler for REST controllers.
 * Translates application-specific exceptions into standardized HTTP responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles cases where traffic data cannot be retrieved from the
     * external traffic data source and returns a service unavailable response.
     *
     * @param exception the exception describing the traffic data retrieval failure
     * @return a standardized API error response with HTTP status 503
     */
    @ExceptionHandler(TrafficDataUnavailableException.class)
    public ResponseEntity<ApiErrorResponse> handleTrafficDataUnavailable(
            TrafficDataUnavailableException exception
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
                "TRAFFIC_DATA_UNAVAILABLE",
                exception.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(response);
    }
}
