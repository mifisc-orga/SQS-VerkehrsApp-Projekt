package de.th_ro.sqs_verkehrsapp.domain.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TrafficDataUnavailableExceptionTest {

    @Test
    void constructorShouldSetMessageAndCause() {

        RuntimeException cause =
                new RuntimeException("Connection timeout");

        TrafficDataUnavailableException exception =
                new TrafficDataUnavailableException(
                        "Traffic API unavailable",
                        cause
                );

        assertThat(exception.getMessage())
                .isEqualTo("Traffic API unavailable");

        assertThat(exception.getCause())
                .isEqualTo(cause);
    }
}