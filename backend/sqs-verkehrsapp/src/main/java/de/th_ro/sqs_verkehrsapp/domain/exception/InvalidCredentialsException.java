package de.th_ro.sqs_verkehrsapp.domain.exception;

/**
 * Exception thrown when user authentication fails.
 * <p>
 * Indicates that the provided credentials are invalid and the user
 * could not be authenticated successfully.
 */
public class InvalidCredentialsException extends RuntimeException {

    /**
     * Creates a new authentication exception.
     *
     * @param message the exception message describing the authentication failure
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
