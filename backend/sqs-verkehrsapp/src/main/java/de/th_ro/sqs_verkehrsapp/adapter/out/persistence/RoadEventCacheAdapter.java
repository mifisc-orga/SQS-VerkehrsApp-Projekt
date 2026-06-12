package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.CachedRoadEventEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.CachedRoadEventRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Persistence adapter for the traffic event cache.
 * <p>
 * Implements {@link RoadEventCachePort} and stores as well as retrieves
 * traffic events from the database. Domain objects are converted to
 * persistence entities and vice versa.
 */
@Component
public class RoadEventCacheAdapter implements RoadEventCachePort {

    private final CachedRoadEventRepository repository;

    /**
     * Creates a new adapter for accessing the traffic event cache.
     *
     * @param repository repository for cached traffic events
     */
    public RoadEventCacheAdapter(CachedRoadEventRepository repository) {
        this.repository = repository;
    }

    /**
     * Saves the traffic events of a motorway in the cache.
     * Existing cache entries for the motorway are removed beforehand.
     *
     * @param roadId the motorway identifier
     * @param events the traffic events to be cached
     */
    @Override
    @Transactional
    public void save(String roadId, List<RoadEvent> events) {
        repository.deleteByRoadId(roadId);

        LocalDateTime cachedAt = LocalDateTime.now();

        List<CachedRoadEventEntity> entities = events.stream()
                .map(event -> CachedRoadEventEntity.builder()
                        .roadId(roadId)
                        .eventId(event.id())
                        .title(event.title())
                        .subtitle(event.subtitle())
                        .type(event.type().name())
                        .latitude(event.coordinate().latitude())
                        .longitude(event.coordinate().longitude())
                        .cachedAt(cachedAt)
                        .build()
                )
                .toList();

        repository.saveAll(entities);
    }

    /**
     * Finds the cached traffic events for a motorway.
     *
     * @param roadId the motorway identifier
     * @return the result object containing the cached events and
     *         associated cache information
     */
    @Override
    public TrafficEventsResult findByRoadId(String roadId) {
        List<CachedRoadEventEntity> entities = repository.findByRoadId(roadId);

        if (entities.isEmpty()) {
            return new TrafficEventsResult(
                    List.of(),
                    false,
                    null,
                    0
            );
        }

        LocalDateTime cachedAt = entities.get(0).getCachedAt();

        List<RoadEvent> events = entities.stream()
                .map(entity -> new RoadEvent(
                        entity.getEventId(),
                        entity.getRoadId(),
                        entity.getTitle(),
                        entity.getSubtitle(),
                        "",
                        RoadEventType.valueOf(entity.getType()),
                        new Coordinate(entity.getLatitude(), entity.getLongitude()),
                        null
                ))
                .toList();

        return new TrafficEventsResult(
                events,
                false,
                cachedAt,
                0
        );
    }
}
