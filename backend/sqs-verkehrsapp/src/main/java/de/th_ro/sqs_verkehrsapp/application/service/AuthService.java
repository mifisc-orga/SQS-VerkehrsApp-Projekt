package de.th_ro.sqs_verkehrsapp.application.service;


import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.UserPort;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service implementation of {@link AuthUseCase}.
 * <p>
 * Handles user registration and authentication by validating credentials
 * and managing the persistence of user accounts.
 */
@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {

    private final UserPort userPort;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user.
     * <p>
     * Creates a new user account, encodes the password, and persists
     * the user if the username is not already taken.
     *
     * @param username the desired username
     * @param password the user's password
     * @return the registered user
     * @throws IllegalArgumentException if the username is already in use
     */
    @Override
    public AppUser register(String username, String password) {

        if (userPort.existsByUsername(username)) {
            throw new IllegalArgumentException("Username ist bereits vergeben");
        }

        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username(username)
                .passwordHash(passwordEncoder.encode(password))
                .build();

        return userPort.save(user);
    }

    /**
     * Authenticates a user using the provided login credentials.
     *
     * @param username the username
     * @param password the user's password
     * @return the authenticated user
     * @throws IllegalArgumentException if the credentials are invalid
     */
    @Override
    public AppUser login(String username, String password) {

        AppUser user = userPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Ungültige Login-Daten"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Ungültige Login-Daten");
        }

        return user;
    }
}
