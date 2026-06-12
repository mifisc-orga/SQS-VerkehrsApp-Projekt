package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.AvailableRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.AvailableRoadRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Persistence adapter for the cache of available motorways.
 * <p>
 * Implements {@link AvailableRoadCachePort} and stores motorway identifiers
 * provided by the Autobahn API in the database.
 */
@Component
public class AvailableRoadsCacheAdapter implements AvailableRoadCachePort {

    private final AvailableRoadRepository repository;

    /**
     * Creates a new adapter for accessing the available roads cache.
     *
     * @param repository repository for available motorway identifiers
     */
    public AvailableRoadsCacheAdapter(AvailableRoadRepository repository) {
        this.repository = repository;
    }

    /**
     * Saves all provided motorway identifiers in the cache.
     * Existing entries are removed beforehand.
     *
     * @param roadIds the motorway identifiers to be cached
     */
    @Override
    public void saveAll(List<String> roadIds) {
        repository.deleteAll();

        List<AvailableRoadEntity> entities = roadIds.stream()
                .map(AvailableRoadEntity::new)
                .toList();

        repository.saveAll(entities);
    }

    /**
     * Retrieves all motorway identifiers stored in the cache.
     *
     * @return a list of available motorway identifiers
     */
    @Override
    public List<String> findAll() {
        return repository.findAll()
                .stream()
                .map(AvailableRoadEntity::getRoadId)
                .toList();
    }
}
