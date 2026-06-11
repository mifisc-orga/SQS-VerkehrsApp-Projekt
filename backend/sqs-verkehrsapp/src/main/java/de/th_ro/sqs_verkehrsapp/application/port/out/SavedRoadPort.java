package de.th_ro.sqs_verkehrsapp.application.port.out;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import java.util.List;
import java.util.UUID;

/**
 * Output port for managing saved motorways.
 * <p>
 * Defines persistence operations for storing, retrieving,
 * and removing motorways saved by users.
 */
public interface SavedRoadPort {

    /**
     * Persists a saved motorway.
     *
     * @param savedRoad the saved motorway to persist
     * @return the persisted saved motorway
     */
    SavedRoad save(SavedRoad savedRoad);

    /**
     * Retrieves all motorways saved by a specific user.
     *
     * @param userId the user identifier
     * @return a list of saved motorways
     */
    List<SavedRoad> findByUserId(UUID userId);

    /**
     * Checks whether a specific motorway has already been saved by a user.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     * @return {@code true} if the motorway is already saved,
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
