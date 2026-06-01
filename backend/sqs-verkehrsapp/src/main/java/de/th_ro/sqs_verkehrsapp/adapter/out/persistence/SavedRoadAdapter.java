package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;


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

    private SavedRoad mapToDomain(SavedRoadEntity entity) {
        return SavedRoad.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .roadId(entity.getRoadId())
                .build();
    }
}
