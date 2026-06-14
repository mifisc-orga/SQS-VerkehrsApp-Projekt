package de.th_ro.sqs_verkehrsapp.application.port.out;

import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;

import java.util.Optional;

/**
 * Output port for managing application users.
 * <p>
 * Defines persistence operations for storing and retrieving user data
 * required for authentication and user management.
 */
public interface UserPort {

    /**
     * Saves a user.
     *
     * @param user the user to persist
     * @return the persisted user
     */
    AppUser save(AppUser user);

    /**
     * Finds a user by their username.
     *
     * @param username the username
     * @return the found user or an empty {@link Optional} if no user exists
     */
    Optional<AppUser> findByUsername(String username);

    /**
     * Checks whether a user with the specified username exists.
     *
     * @param username the username
     * @return {@code true} if a user exists, {@code false} otherwise
     */
    boolean existsByUsername(String username);
}
