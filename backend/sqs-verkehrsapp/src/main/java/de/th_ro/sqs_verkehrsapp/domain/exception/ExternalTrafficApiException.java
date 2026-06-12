package de.th_ro.sqs_verkehrsapp.domain.exception;

/**
 * Exception thrown when communication with the external traffic API fails.
 * <p>
 * Wraps errors that occur while retrieving traffic data from external services.
 */
public class ExternalTrafficApiException extends RuntimeException {

    /**
     * Creates a new exception for external traffic API failures.
     *
     * @param message the exception message
     * @param cause the underlying cause of the failure
     */
    public ExternalTrafficApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
