package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Asynchronous writer component for persisting traffic-related data
 * into the configured cache implementations.
 */
@Component
public class AutobahnCacheWriter {

    private final RoadEventCachePort cachePort;
    private final AvailableRoadCachePort availableRoadCachePort;

    /**
     * Creates a new cache writer with the required cache ports.
     *
     * @param cachePort cache for traffic events
     * @param availableRoadCachePort cache for available road identifiers
     */
    public AutobahnCacheWriter(
            RoadEventCachePort cachePort,
            AvailableRoadCachePort availableRoadCachePort
    ) {
        this.cachePort = cachePort;
        this.availableRoadCachePort = availableRoadCachePort;
    }

    /**
     * Stores traffic events for the specified road asynchronously.
     *
     * @param roadId identifier of the road
     * @param events traffic events to be cached
     */
    @Async
    public void saveTrafficEvents(String roadId, List<RoadEvent> events) {
        cachePort.save(roadId, events);
    }

    /**
     * Stores the list of available road identifiers asynchronously.
     *
     * @param roadIds road identifiers to be cached
     */
    @Async
    public void saveAvailableRoadIds(List<String> roadIds) {
        availableRoadCachePort.saveAll(roadIds);
    }
}
