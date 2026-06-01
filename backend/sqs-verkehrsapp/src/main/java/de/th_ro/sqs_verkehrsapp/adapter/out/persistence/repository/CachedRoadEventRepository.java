package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.CachedRoadEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CachedRoadEventRepository extends JpaRepository<CachedRoadEventEntity, Long> {

    List<CachedRoadEventEntity> findByRoadId(String roadId);

    void deleteByRoadId(String roadId);
}
