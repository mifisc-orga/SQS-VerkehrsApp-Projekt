package de.th_ro.sqs_verkehrsapp.domain.model;


import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Domain model representing an application user.
 * <p>
 * Contains the user information required for authentication
 * and user management within the application.
 */
@Getter
@Builder
@AllArgsConstructor
public class AppUser {

    private UUID id;
    private String username;
    private String passwordHash;
}
