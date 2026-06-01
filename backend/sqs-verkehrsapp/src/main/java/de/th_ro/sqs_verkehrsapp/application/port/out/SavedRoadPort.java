package de.th_ro.sqs_verkehrsapp.application.port.out;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;

import java.util.List;
import java.util.UUID;

public interface SavedRoadPort {

    SavedRoad save(SavedRoad savedRoad);

    List<SavedRoad> findByUserId(UUID userId);

    boolean existsByUserIdAndRoadId(UUID userId, String roadId);

    void deleteByUserIdAndRoadId(UUID userId, String roadId);
}
