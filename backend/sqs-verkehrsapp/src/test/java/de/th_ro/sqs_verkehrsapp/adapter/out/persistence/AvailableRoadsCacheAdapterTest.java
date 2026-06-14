package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.AvailableRoadEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.AvailableRoadRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvailableRoadsCacheAdapterTest {

    @Mock
    private AvailableRoadRepository repository;

    @InjectMocks
    private AvailableRoadsCacheAdapter adapter;

    @Test
    void saveAllShouldDeleteExistingEntriesBeforeSavingNewRoadIds() {
        List<String> roadIds = List.of("A1", "A2", "A3");

        adapter.saveAll(roadIds);

        verify(repository).deleteAll();
    }

    @Test
    void saveAllShouldSaveRoadIdsAsEntities() {
        List<String> roadIds = List.of("A1", "A2", "A3");

        adapter.saveAll(roadIds);

        ArgumentCaptor<List<AvailableRoadEntity>> captor =
                ArgumentCaptor.forClass(List.class);

        verify(repository).saveAll(captor.capture());

        assertThat(captor.getValue())
                .extracting(AvailableRoadEntity::getRoadId)
                .containsExactly("A1", "A2", "A3");
    }

    @Test
    void saveAllShouldSaveEmptyListWhenRoadIdsAreEmpty() {
        adapter.saveAll(List.of());

        ArgumentCaptor<List<AvailableRoadEntity>> captor =
                ArgumentCaptor.forClass(List.class);

        verify(repository).deleteAll();
        verify(repository).saveAll(captor.capture());

        assertThat(captor.getValue()).isEmpty();
    }

    @Test
    void findAllShouldReturnAllRoadIdsFromRepository() {
        when(repository.findAll()).thenReturn(List.of(
                new AvailableRoadEntity("A1"),
                new AvailableRoadEntity("A2"),
                new AvailableRoadEntity("A3")
        ));

        List<String> result = adapter.findAll();

        assertThat(result).containsExactly("A1", "A2", "A3");
    }

    @Test
    void findAllShouldReturnEmptyListWhenRepositoryIsEmpty() {
        when(repository.findAll()).thenReturn(List.of());

        List<String> result = adapter.findAll();

        assertThat(result).isEmpty();
    }
}