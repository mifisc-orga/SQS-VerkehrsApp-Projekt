package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn;

import de.th_ro.sqs_verkehrsapp.application.port.out.AvailableRoadCachePort;
import de.th_ro.sqs_verkehrsapp.application.port.out.RoadEventCachePort;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AutobahnCacheWriterTest {

    @Mock
    private RoadEventCachePort cachePort;

    @Mock
    private AvailableRoadCachePort availableRoadCachePort;

    @InjectMocks
    private AutobahnCacheWriter cacheWriter;

    @Test
    void saveTrafficEvents_shouldSaveEventsInCache() {
        String roadId = "A1";
        List<RoadEvent> events = List.of();

        cacheWriter.saveTrafficEvents(roadId, events);

        verify(cachePort).save(roadId, events);
    }

    @Test
    void saveAvailableRoadIds_shouldSaveRoadIdsInCache() {
        List<String> roadIds = List.of("A1", "A2", "A3");

        cacheWriter.saveAvailableRoadIds(roadIds);

        verify(availableRoadCachePort).saveAll(roadIds);
    }

}