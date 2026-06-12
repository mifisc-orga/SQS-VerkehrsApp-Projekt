package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing motorways saved by users.
 * <p>
 * Provides CRUD operations as well as search and management functionality
 * for user favorites.
 */
public interface SavedRoadRepository extends JpaRepository<SavedRoadEntity, UUID> {

    /**
     * Returns all motorways saved by a specific user.
     *
     * @param userId the user identifier
     * @return a list of saved motorways
     */
    List<SavedRoadEntity> findByUserId(UUID userId);

    /**
     * Checks whether a user has already saved a specific motorway.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     * @return {@code true} if the motorway has already been saved,
     *         {@code false} otherwise
     */
    boolean existsByUserIdAndRoadId(UUID userId, String roadId);

    /**
     * Removes a saved motorway for a specific user.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     */
    void deleteByUserIdAndRoadId(UUID userId, String roadId);
}
