package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.in.SavedRoadUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service implementation of {@link SavedRoadUseCase}.
 * <p>
 * Manages a user's saved motorways, including adding, retrieving,
 * and removing favorite motorways.
 */
@Service
@RequiredArgsConstructor
public class SavedRoadService implements SavedRoadUseCase {

    private final SavedRoadPort savedRoadPort;

    /**
     * Saves a motorway for a specific user.
     * <p>
     * The motorway identifier is normalized before being stored.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     * @return the saved motorway
     * @throws IllegalArgumentException if the motorway has already been saved
     */
    @Override
    public SavedRoad saveRoad(UUID userId, String roadId) {

        String normalizedRoadId = roadId.trim().toUpperCase();

        if (savedRoadPort.existsByUserIdAndRoadId(userId, normalizedRoadId)) {
            throw new IllegalArgumentException("Diese Autobahn wurde bereits gespeichert");
        }

        SavedRoad savedRoad = SavedRoad.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId(normalizedRoadId)
                .build();

        return savedRoadPort.save(savedRoad);
    }

    /**
     * Retrieves all motorways saved by a specific user.
     *
     * @param userId the user identifier
     * @return a list of saved motorways
     */
    @Override
    public List<SavedRoad> getSavedRoads(UUID userId) {
        return savedRoadPort.findByUserId(userId);
    }

    /**
     * Deletes a saved motorway for a specific user.
     *
     * @param userId the user identifier
     * @param roadId the motorway identifier
     */
    @Override
    public void deleteRoad(UUID userId, String roadId) {
        savedRoadPort.deleteByUserIdAndRoadId(
                userId,
                roadId.trim().toUpperCase()
        );
    }
}
