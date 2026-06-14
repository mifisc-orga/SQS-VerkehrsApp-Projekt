package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;

import java.util.List;
import java.util.UUID;

/**
 * Input port for managing saved motorways.
 * <p>
 * Defines the application use cases for adding, retrieving,
 * and removing a user's saved motorways.
 */
public interface SavedRoadUseCase {

    /**
     * Saves a motorway for a specific user.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     * @return the saved motorway
     */
    SavedRoad saveRoad(UUID userId, String roadId);

    /**
     * Retrieves all motorways saved by a specific user.
     *
     * @param userId the user identifier
     * @return a list of saved motorways
     */
    List<SavedRoad> getSavedRoads(UUID userId);

    /**
     * Deletes a saved motorway for a specific user.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     */
    void deleteRoad(UUID userId, String roadId);
}
