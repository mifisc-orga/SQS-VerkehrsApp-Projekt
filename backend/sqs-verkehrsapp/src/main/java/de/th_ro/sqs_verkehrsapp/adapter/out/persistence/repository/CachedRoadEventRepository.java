package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.CachedRoadEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for accessing cached traffic events.
 * <p>
 * Provides CRUD operations as well as search and deletion functionality
 * for cached traffic events.
 */
public interface CachedRoadEventRepository extends JpaRepository<CachedRoadEventEntity, Long> {

    /**
     * Finds all cached traffic events for a specific motorway.
     *
     * @param roadId the motorway identifier
     * @return all associated traffic events
     */
    List<CachedRoadEventEntity> findByRoadId(String roadId);

    /**
     * Deletes all cached traffic events for a specific motorway.
     *
     * @param roadId the motorway identifier
     */
    void deleteByRoadId(String roadId);
}
