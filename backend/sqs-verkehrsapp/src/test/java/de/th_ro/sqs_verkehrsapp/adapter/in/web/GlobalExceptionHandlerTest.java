package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.adapter.in.web.dto.ApiErrorResponse;
import de.th_ro.sqs_verkehrsapp.domain.exception.TrafficDataUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler globalExceptionHandler =
            new GlobalExceptionHandler();

    @Test
    void handleTrafficDataUnavailableShouldReturnServiceUnavailableResponse() {
        TrafficDataUnavailableException exception =
                new TrafficDataUnavailableException("Traffic API is unavailable",  new RuntimeException("Connection timeout"));

        ResponseEntity<ApiErrorResponse> response =
                globalExceptionHandler.handleTrafficDataUnavailable(exception);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);

        assertThat(response.getBody())
                .isNotNull();

        assertThat(response.getBody().code())
                .isEqualTo("TRAFFIC_DATA_UNAVAILABLE");

        assertThat(response.getBody().message())
                .isEqualTo("Traffic API is unavailable");

        assertThat(response.getBody().timestamp())
                .isNotNull();
    }

}