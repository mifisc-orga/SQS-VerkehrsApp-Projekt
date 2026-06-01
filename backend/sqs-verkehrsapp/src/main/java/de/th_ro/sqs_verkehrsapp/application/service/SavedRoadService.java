package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.in.SavedRoadUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SavedRoadService implements SavedRoadUseCase {

    private final SavedRoadPort savedRoadPort;

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

    @Override
    public List<SavedRoad> getSavedRoads(UUID userId) {
        return savedRoadPort.findByUserId(userId);
    }

    @Override
    public void deleteRoad(UUID userId, String roadId) {
        savedRoadPort.deleteByUserIdAndRoadId(
                userId,
                roadId.trim().toUpperCase()
        );
    }
}
