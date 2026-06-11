package de.th_ro.sqs_verkehrsapp.domain.exception;

/**
 * Exception thrown when traffic data cannot be retrieved or provided.
 * <p>
 * Indicates that traffic information is unavailable, for example due to
 * external service failures or missing cached data.
 */
public class TrafficDataUnavailableException extends RuntimeException {

    /**
     * Creates a new exception indicating that traffic data is unavailable.
     *
     * @param message the exception message
     * @param cause the underlying cause of the failure
     */
    public TrafficDataUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
