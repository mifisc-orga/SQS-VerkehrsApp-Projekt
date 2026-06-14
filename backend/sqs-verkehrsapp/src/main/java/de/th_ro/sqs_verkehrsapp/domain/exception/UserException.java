package de.th_ro.sqs_verkehrsapp.domain.exception;

/**
 * Exception thrown for user-related errors.
 * <p>
 * Indicates failures related to user management, registration,
 * authentication, or other user-specific operations.
 */
public class UserException extends RuntimeException {

    /**
     * Creates a new user exception.
     *
     * @param message the exception message
     */
    public UserException(String message) {
        super(message);
    }
}
