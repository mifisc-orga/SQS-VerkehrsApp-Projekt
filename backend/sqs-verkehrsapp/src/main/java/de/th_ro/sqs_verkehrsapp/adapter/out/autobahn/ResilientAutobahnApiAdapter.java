package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.exception.TrafficDataUnavailableException;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Primary
public class ResilientAutobahnApiAdapter implements AutobahnApiPort {

    private final AutobahnApiClient autobahnApiClient;
    private final RoadEventCachePort cachePort;

    public ResilientAutobahnApiAdapter(
            AutobahnApiClient autobahnApiClient,
            RoadEventCachePort cachePort
    ) {
        this.autobahnApiClient = autobahnApiClient;
        this.cachePort = cachePort;
    }

    @Override
    @Retry(name = "autobahnApi", fallbackMethod = "getTrafficEventsFallback")
    @CircuitBreaker(name = "autobahnApi", fallbackMethod = "getTrafficEventsFallback")
    public TrafficEventsResult getTrafficEvents(String roadId) {
        List<RoadEvent> events = autobahnApiClient.fetchTrafficEvents(roadId);

        cachePort.save(roadId, events);

        return new TrafficEventsResult(
                events,
                true,
                LocalDateTime.now(),
                0
        );
    }

    @Override
    @Retry(name = "autobahnApi", fallbackMethod = "getAvailableRoadIdsFallback")
    @CircuitBreaker(name = "autobahnApi", fallbackMethod = "getAvailableRoadIdsFallback")
    public List<String> getAvailableRoadIds() {
        return autobahnApiClient.getAvailableRoadIds();
    }

    public TrafficEventsResult getTrafficEventsFallback(String roadId, Throwable throwable) {
        TrafficEventsResult cachedResult = cachePort.findByRoadId(roadId);

        if (cachedResult != null && cachedResult.events() != null && !cachedResult.events().isEmpty()) {
            return new TrafficEventsResult(
                    cachedResult.events(),
                    false,
                    cachedResult.cachedAt(),
                    0
            );
        }

        throw new TrafficDataUnavailableException(
                "Autobahn API nicht verfügbar und keine Cache-Daten vorhanden für " + roadId,
                throwable
        );
    }

    public List<String> getAvailableRoadIdsFallback(Throwable throwable) {
        throw new TrafficDataUnavailableException(
                "Autobahn API nicht verfügbar. Autobahnen konnten nicht geladen werden.",
                throwable
        );
    }
}
