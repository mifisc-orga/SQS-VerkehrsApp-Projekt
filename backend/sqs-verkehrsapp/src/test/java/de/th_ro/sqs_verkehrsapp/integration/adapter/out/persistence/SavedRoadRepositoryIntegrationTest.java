package de.th_ro.sqs_verkehrsapp.integration.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class SavedRoadRepositoryIntegrationTest {

    @Autowired
    private SavedRoadRepository repository;

    @Test
    public void shouldSaveAndFindRoadsByUserId() {
        UUID userId = UUID.randomUUID();

        repository.save(SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A8")
                .build());

        repository.save(SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A3")
                .build());

        List<SavedRoadEntity> result = repository.findByUserId(userId);

        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting(SavedRoadEntity::getRoadId)
                .containsExactlyInAnyOrder("A8", "A3");
    }

    @Test
    public void shouldDetectExistingRoadForUser() {
        UUID userId = UUID.randomUUID();

        repository.save(SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A8")
                .build());

        boolean exists = repository.existsByUserIdAndRoadId(userId, "A8");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldDeleteRoadByUserIdAndRoadId() {
        UUID userId = UUID.randomUUID();

        repository.save(SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A8")
                .build());

        repository.deleteByUserIdAndRoadId(userId, "A8");

        List<SavedRoadEntity> result = repository.findByUserId(userId);

        assertThat(result).isEmpty();
    }
}
