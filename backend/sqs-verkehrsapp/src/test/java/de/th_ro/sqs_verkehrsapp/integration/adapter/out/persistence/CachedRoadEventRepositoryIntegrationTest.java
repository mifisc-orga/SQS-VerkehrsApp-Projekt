package de.th_ro.sqs_verkehrsapp.integration.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.CachedRoadEventEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.CachedRoadEventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class CachedRoadEventRepositoryIntegrationTest {

    private CachedRoadEventRepository repository;

    @Autowired
    CachedRoadEventRepositoryIntegrationTest(CachedRoadEventRepository repository) {
        this.repository = repository;
    }

    @Test
    void findByRoadIdShouldReturnOnlyEventsForGivenRoadId() {

        repository.saveAll(createTestEntities());

        List<CachedRoadEventEntity> result = repository.findByRoadId("A1");

        assertEquals(1, result.size());
        assertEquals("event-1", result.get(0).getEventId());
        assertEquals("A1", result.get(0).getRoadId());
    }

    @Test
    void deleteByRoadIdShouldDeleteOnlyEventsForGivenRoadId() {
        repository.saveAll(createTestEntities());

        repository.deleteByRoadId("A1");

        assertTrue(repository.findByRoadId("A1").isEmpty());
        assertEquals(1, repository.findByRoadId("A2").size());
    }

    List<CachedRoadEventEntity> createTestEntities() {
        CachedRoadEventEntity eventA1 = CachedRoadEventEntity.builder()
                .roadId("A1")
                .eventId("event-1")
                .title("Stau")
                .subtitle("5 km")
                .type("WARNING")
                .latitude(52.1)
                .longitude(13.4)
                .cachedAt(LocalDateTime.now())
                .build();

        CachedRoadEventEntity eventA2 = CachedRoadEventEntity.builder()
                .roadId("A2")
                .eventId("event-2")
                .title("Baustelle")
                .subtitle("gesperrt")
                .type("ROADWORK")
                .latitude(53.1)
                .longitude(14.4)
                .cachedAt(LocalDateTime.now())
                .build();
        return List.of(eventA1, eventA2);
    }
}
