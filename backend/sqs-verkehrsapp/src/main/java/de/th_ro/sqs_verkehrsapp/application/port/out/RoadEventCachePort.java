package de.th_ro.sqs_verkehrsapp.application.port.out;

import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;

import java.util.List;

/**
 * Output port for caching traffic events.
 * <p>
 * Defines operations for storing and retrieving traffic events
 * associated with a motorway.
 */
public interface RoadEventCachePort {

    /**
     * Saves traffic events for a specific motorway in the cache.
     *
     * @param roadId the motorway identifier
     * @param events the traffic events to cache
     */
    void save(String roadId, List<RoadEvent> events);

    /**
     * Finds cached traffic events for a specific motorway.
     *
     * @param roadId the motorway identifier
     * @return the cached traffic events result
     */
    TrafficEventsResult findByRoadId(String roadId);
}
