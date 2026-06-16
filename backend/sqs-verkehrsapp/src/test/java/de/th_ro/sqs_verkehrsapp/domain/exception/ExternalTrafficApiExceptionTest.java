package de.th_ro.sqs_verkehrsapp.domain.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExternalTrafficApiExceptionTest {

    @Test
    void shouldCreateExceptionWithMessageAndCause() {
        RuntimeException cause = new RuntimeException("API not reachable");

        ExternalTrafficApiException exception =
                new ExternalTrafficApiException("External traffic API failed", cause);

        assertThat(exception.getMessage())
                .isEqualTo("External traffic API failed");

        assertThat(exception.getCause())
                .isSameAs(cause);
    }

}