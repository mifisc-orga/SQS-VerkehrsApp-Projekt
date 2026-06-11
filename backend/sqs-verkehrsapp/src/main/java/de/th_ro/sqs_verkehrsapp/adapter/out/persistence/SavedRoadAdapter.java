package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Persistence adapter for motorways saved by a user.
 * <p>
 * Implements {@link SavedRoadPort} and is responsible for persistence
 * as well as mapping between domain models and JPA entities.
 */
@Component
@RequiredArgsConstructor
public class SavedRoadAdapter implements SavedRoadPort {

    private final SavedRoadRepository repository;

    @Override
    public SavedRoad save(SavedRoad savedRoad) {

        SavedRoadEntity entity = SavedRoadEntity.builder()
                .id(savedRoad.getId())
                .userId(savedRoad.getUserId())
                .roadId(savedRoad.getRoadId())
                .build();

        return mapToDomain(repository.save(entity));
    }

    @Override
    public List<SavedRoad> findByUserId(UUID userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public boolean existsByUserIdAndRoadId(UUID userId, String roadId) {
        return repository.existsByUserIdAndRoadId(userId, roadId);
    }

    @Override
    public void deleteByUserIdAndRoadId(UUID userId, String roadId) {
        repository.deleteByUserIdAndRoadId(userId, roadId);
    }

    /**
     * Converts a persistence entity into the corresponding domain model.
     *
     * @param entity the persistence entity
     * @return the domain model
     */
    private SavedRoad mapToDomain(SavedRoadEntity entity) {
        return SavedRoad.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .roadId(entity.getRoadId())
                .build();
    }
}
