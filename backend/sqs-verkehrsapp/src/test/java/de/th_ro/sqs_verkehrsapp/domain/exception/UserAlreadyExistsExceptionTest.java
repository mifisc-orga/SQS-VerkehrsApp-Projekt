package de.th_ro.sqs_verkehrsapp.domain.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserAlreadyExistsExceptionTest {

    @Test
    void shouldCreateExceptionWithMessage() {
        UserAlreadyExistsException exception =
                new UserAlreadyExistsException("User already exists");

        assertThat(exception.getMessage())
                .isEqualTo("User already exists");
    }

}