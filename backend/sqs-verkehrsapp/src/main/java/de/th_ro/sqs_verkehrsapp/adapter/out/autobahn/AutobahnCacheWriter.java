package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AutobahnCacheWriter {

    private final RoadEventCachePort cachePort;
    private final AvailableRoadCachePort availableRoadCachePort;

    public AutobahnCacheWriter(
            RoadEventCachePort cachePort,
            AvailableRoadCachePort availableRoadCachePort
    ) {
        this.cachePort = cachePort;
        this.availableRoadCachePort = availableRoadCachePort;
    }

    @Async
    public void saveTrafficEvents(String roadId, List<RoadEvent> events) {
        cachePort.save(roadId, events);
    }

    @Async
    public void saveAvailableRoadIds(List<String> roadIds) {
        availableRoadCachePort.saveAll(roadIds);
    }
}
