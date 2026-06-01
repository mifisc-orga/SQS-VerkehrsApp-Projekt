package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;

import java.util.List;
import java.util.UUID;

public interface SavedRoadUseCase {

    SavedRoad saveRoad(UUID userId, String roadId);

    List<SavedRoad> getSavedRoads(UUID userId);

    void deleteRoad(UUID userId, String roadId);
}
