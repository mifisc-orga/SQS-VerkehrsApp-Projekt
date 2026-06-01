package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SavedRoadRepository extends JpaRepository<SavedRoadEntity, UUID> {

    List<SavedRoadEntity> findByUserId(UUID userId);

    boolean existsByUserIdAndRoadId(UUID userId, String roadId);

    void deleteByUserIdAndRoadId(UUID userId, String roadId);
}
