package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
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
    private final AvailableRoadCachePort availableRoadCachePort;
    private final AutobahnCacheWriter autobahnCacheWriter;

    private static final String ALL_ROADS_CACHE_KEY = "ALL";

    public ResilientAutobahnApiAdapter(
            AutobahnApiClient autobahnApiClient,
            RoadEventCachePort cachePort,
            AvailableRoadCachePort availableRoadCachePort,
            AutobahnCacheWriter autobahnCacheWriter
    ) {
        this.autobahnApiClient = autobahnApiClient;
        this.cachePort = cachePort;
        this.availableRoadCachePort = availableRoadCachePort;
        this.autobahnCacheWriter = autobahnCacheWriter;
    }

    @Override
    @Retry(name = "autobahnApi", fallbackMethod = "getTrafficEventsFallback")
    @CircuitBreaker(name = "autobahnApi", fallbackMethod = "getTrafficEventsFallback")
    public TrafficEventsResult getTrafficEvents(String roadId) {
        List<RoadEvent> events = autobahnApiClient.fetchTrafficEvents(roadId);

        autobahnCacheWriter.saveTrafficEvents(roadId, events);

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
        List<String> roadIds = autobahnApiClient.getAvailableRoadIds();

        if (roadIds != null && !roadIds.isEmpty()) {
            autobahnCacheWriter.saveAvailableRoadIds(roadIds);
        }

        return roadIds;
    }

    @Override
    @Retry(name = "autobahnApi", fallbackMethod = "getAllTrafficEventsFallback")
    @CircuitBreaker(name = "autobahnApi", fallbackMethod = "getAllTrafficEventsFallback")
    public TrafficEventsResult getAllTrafficEvents() {
        List<String> roadIds = getAvailableRoadIds();

        List<RoadEvent> events = roadIds.stream()
                .flatMap(roadId -> getTrafficEvents(roadId).events().stream())
                .toList();

        autobahnCacheWriter.saveTrafficEvents(ALL_ROADS_CACHE_KEY, events);

        return new TrafficEventsResult(
                events,
                true,
                LocalDateTime.now(),
                0
        );
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

    public TrafficEventsResult getAllTrafficEventsFallback(Throwable throwable) {
        TrafficEventsResult cachedResult = cachePort.findByRoadId(ALL_ROADS_CACHE_KEY);

        if (cachedResult != null && cachedResult.events() != null && !cachedResult.events().isEmpty()) {
            return new TrafficEventsResult(
                    cachedResult.events(),
                    false,
                    cachedResult.cachedAt(),
                    0
            );
        }

        throw new TrafficDataUnavailableException(
                "Autobahn API nicht verfügbar und keine Cache-Daten für alle Verkehrsmeldungen vorhanden.",
                throwable
        );
    }

    public List<String> getAvailableRoadIdsFallback(Throwable throwable) {
        List<String> cachedRoadIds = availableRoadCachePort.findAll();

        if (cachedRoadIds != null && !cachedRoadIds.isEmpty()) {
            return cachedRoadIds;
        }

        throw new TrafficDataUnavailableException(
                "Autobahn API nicht verfügbar und keine gecachten Autobahnen vorhanden.",
                throwable
        );
    }
}
