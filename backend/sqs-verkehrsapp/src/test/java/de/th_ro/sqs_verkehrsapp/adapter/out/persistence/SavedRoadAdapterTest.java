package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.SavedRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavedRoadAdapterTest {

    @Mock
    private SavedRoadRepository repository;

    @InjectMocks
    private SavedRoadAdapter adapter;

    @Test
    void saveShouldMapDomainToEntityAndReturnSavedDomainObject() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        SavedRoad savedRoad = SavedRoad.builder()
                .id(id)
                .userId(userId)
                .roadId("A3")
                .build();

        SavedRoadEntity savedEntity = SavedRoadEntity.builder()
                .id(id)
                .userId(userId)
                .roadId("A3")
                .build();

        when(repository.save(org.mockito.ArgumentMatchers.any(SavedRoadEntity.class)))
                .thenReturn(savedEntity);

        SavedRoad result = adapter.save(savedRoad);

        ArgumentCaptor<SavedRoadEntity> captor =
                ArgumentCaptor.forClass(SavedRoadEntity.class);

        verify(repository).save(captor.capture());

        SavedRoadEntity captured = captor.getValue();

        assertThat(captured.getId()).isEqualTo(id);
        assertThat(captured.getUserId()).isEqualTo(userId);
        assertThat(captured.getRoadId()).isEqualTo("A3");

        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getUserId()).isEqualTo(userId);
        assertThat(result.getRoadId()).isEqualTo("A3");
    }

    @Test
    void findByUserIdShouldMapEntitiesToDomainObjects() {
        UUID userId = UUID.randomUUID();

        SavedRoadEntity entity1 = SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A1")
                .build();

        SavedRoadEntity entity2 = SavedRoadEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .roadId("A3")
                .build();

        when(repository.findByUserId(userId))
                .thenReturn(List.of(entity1, entity2));

        List<SavedRoad> result = adapter.findByUserId(userId);

        assertThat(result).hasSize(2);

        assertThat(result)
                .extracting(SavedRoad::getRoadId)
                .containsExactly("A1", "A3");

        assertThat(result)
                .extracting(SavedRoad::getUserId)
                .containsOnly(userId);
    }

    @Test
    void findByUserIdShouldReturnEmptyListWhenNoRoadsExist() {
        UUID userId = UUID.randomUUID();

        when(repository.findByUserId(userId))
                .thenReturn(List.of());

        List<SavedRoad> result = adapter.findByUserId(userId);

        assertThat(result).isEmpty();
    }

    @Test
    void existsByUserIdAndRoadIdShouldReturnTrueWhenRepositoryReturnsTrue() {
        UUID userId = UUID.randomUUID();

        when(repository.existsByUserIdAndRoadId(userId, "A1"))
                .thenReturn(true);

        boolean result =
                adapter.existsByUserIdAndRoadId(userId, "A1");

        assertThat(result).isTrue();
    }

    @Test
    void existsByUserIdAndRoadIdShouldReturnFalseWhenRepositoryReturnsFalse() {
        UUID userId = UUID.randomUUID();

        when(repository.existsByUserIdAndRoadId(userId, "A1"))
                .thenReturn(false);

        boolean result =
                adapter.existsByUserIdAndRoadId(userId, "A1");

        assertThat(result).isFalse();
    }

    @Test
    void deleteByUserIdAndRoadIdShouldDelegateToRepository() {
        UUID userId = UUID.randomUUID();

        adapter.deleteByUserIdAndRoadId(userId, "A1");

        verify(repository)
                .deleteByUserIdAndRoadId(userId, "A1");
    }

}