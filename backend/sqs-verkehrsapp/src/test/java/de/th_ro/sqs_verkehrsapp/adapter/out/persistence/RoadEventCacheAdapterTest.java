package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.CachedRoadEventEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.CachedRoadEventRepository;
import de.th_ro.sqs_verkehrsapp.domain.model.Coordinate;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEvent;
import de.th_ro.sqs_verkehrsapp.domain.model.RoadEventType;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadEventCacheAdapterTest {

    @Mock
    private CachedRoadEventRepository repository;

    @InjectMocks
    private RoadEventCacheAdapter adapter;

    @Test
    void save_shouldDeleteOldEventsAndSaveNewEvents() {
        String roadId = "A1";

        List<RoadEvent> events = List.of(
                new RoadEvent(
                        "event-1",
                        roadId,
                        "Stau",
                        "5 km",
                        "",
                        RoadEventType.WARNING,
                        new Coordinate(52.1, 13.4),
                        null
                )
        );

        adapter.save(roadId, events);

        verify(repository).deleteByRoadId(roadId);

        ArgumentCaptor<List<CachedRoadEventEntity>> captor =
                ArgumentCaptor.forClass(List.class);

        verify(repository).saveAll(captor.capture());

        List<CachedRoadEventEntity> saved = captor.getValue();

        assertEquals(1, saved.size());
        assertEquals("A1", saved.get(0).getRoadId());
        assertEquals("event-1", saved.get(0).getEventId());
        assertEquals("Stau", saved.get(0).getTitle());
        assertEquals("5 km", saved.get(0).getSubtitle());
        assertEquals("WARNING", saved.get(0).getType());
        assertEquals(52.1, saved.get(0).getLatitude());
        assertEquals(13.4, saved.get(0).getLongitude());
        assertNotNull(saved.get(0).getCachedAt());
    }

    @Test
    void findByRoadId_shouldMapEntitiesToRoadEvents() {
        LocalDateTime cachedAt = LocalDateTime.of(2026, 5, 9, 14, 30);
        CachedRoadEventEntity entity = new CachedRoadEventEntity(
                "A1",
                "event-1",
                "Baustelle",
                "rechter Fahrstreifen gesperrt",
                "ROADWORK",
                52.1,
                13.4,
                cachedAt
        );

        when(repository.findByRoadId("A1")).thenReturn(List.of(entity));

        TrafficEventsResult result = adapter.findByRoadId("A1");

        assertFalse(result.live());
        assertEquals(cachedAt, result.cachedAt());
        assertEquals(1, result.events().size());

        RoadEvent event = result.events().get(0);

        assertEquals("event-1", event.id());
        assertEquals("A1", event.roadId());
        assertEquals("Baustelle", event.title());
        assertEquals("rechter Fahrstreifen gesperrt", event.subtitle());
        assertEquals(RoadEventType.ROADWORK, event.type());
        assertEquals(52.1, event.coordinate().latitude());
        assertEquals(13.4, event.coordinate().longitude());
    }

    @Test
    void findByRoadId_shouldReturnEmptyResultWhenNoCachedEventsExist() {
        when(repository.findByRoadId("A2")).thenReturn(List.of());

        TrafficEventsResult result = adapter.findByRoadId("A2");

        assertFalse(result.live());
        assertNull(result.cachedAt());
        assertTrue(result.events().isEmpty());
    }
}
