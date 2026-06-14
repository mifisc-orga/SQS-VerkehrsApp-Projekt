package de.th_ro.sqs_verkehrsapp.application.port.out;

import java.util.List;

/**
 * Output port for caching available motorway identifiers.
 * <p>
 * Defines operations for storing and retrieving available motorways
 * from a local cache.
 */
public interface AvailableRoadCachePort {

    /**
     * Stores all available motorway identifiers in the cache.
     *
     * @param roadIds the motorway identifiers to cache
     */
    void saveAll(List<String> roadIds);

    /**
     * Retrieves all cached motorway identifiers.
     *
     * @return a list of cached motorway identifiers
     */
    List<String> findAll();
}
