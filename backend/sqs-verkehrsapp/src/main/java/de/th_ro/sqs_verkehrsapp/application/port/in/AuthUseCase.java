package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;

/**
 * Input port for authentication-related use cases.
 * <p>
 * Defines the application use cases for user registration and authentication.
 */
public interface AuthUseCase {

    /**
     * Registers a new user.
     *
     * @param username the desired username
     * @param password the user's password
     * @return the registered user
     */
    AppUser register(String username, String password);

    /**
     * Login operation for an existing user.
     *
     * @param username the username
     * @param password the user's password
     * @return the authenticated user
     */
    AppUser login(String username, String password);
}
