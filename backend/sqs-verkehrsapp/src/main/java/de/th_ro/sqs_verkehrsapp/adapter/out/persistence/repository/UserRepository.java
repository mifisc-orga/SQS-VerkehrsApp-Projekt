package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing application users.
 * <p>
 * Provides CRUD operations as well as user-specific lookup functionality
 * for authentication and user management.
 */
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    /**
     * Finds a user by their username.
     *
     * @param username the username
     * @return the found user or an empty {@link Optional}
     *         if no user exists
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Checks whether a user with the specified username exists.
     *
     * @param username the username
     * @return {@code true} if a user exists,
     *         {@code false} otherwise
     */
    boolean existsByUsername(String username);
}
