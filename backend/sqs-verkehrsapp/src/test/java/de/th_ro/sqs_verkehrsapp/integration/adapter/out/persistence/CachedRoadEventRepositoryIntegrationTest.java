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
public class CachedRoadEventRepositoryIntegrationTest {

    @Autowired
    private CachedRoadEventRepository repository;

    @Test
    void findByRoadId_shouldReturnOnlyEventsForGivenRoadId() {
        CachedRoadEventEntity eventA1 = new CachedRoadEventEntity(
                "A1",
                "event-1",
                "Stau",
                "5 km",
                "WARNING",
                52.1,
                13.4,
                LocalDateTime.now()
        );

        CachedRoadEventEntity eventA2 = new CachedRoadEventEntity(
                "A2",
                "event-2",
                "Baustelle",
                "gesperrt",
                "ROADWORK",
                53.1,
                14.4,
                LocalDateTime.now()
        );

        repository.saveAll(List.of(eventA1, eventA2));

        List<CachedRoadEventEntity> result = repository.findByRoadId("A1");

        assertEquals(1, result.size());
        assertEquals("event-1", result.get(0).getEventId());
        assertEquals("A1", result.get(0).getRoadId());
    }

    @Test
    void deleteByRoadId_shouldDeleteOnlyEventsForGivenRoadId() {
        repository.saveAll(List.of(
                new CachedRoadEventEntity(
                        "A1",
                        "event-1",
                        "Stau",
                        "5 km",
                        "WARNING",
                        52.1,
                        13.4,
                        LocalDateTime.now()
                ),
                new CachedRoadEventEntity(
                        "A2",
                        "event-2",
                        "Baustelle",
                        "gesperrt",
                        "ROADWORK",
                        53.1,
                        14.4,
                        LocalDateTime.now()
                )
        ));

        repository.deleteByRoadId("A1");

        assertTrue(repository.findByRoadId("A1").isEmpty());
        assertEquals(1, repository.findByRoadId("A2").size());
    }
}
