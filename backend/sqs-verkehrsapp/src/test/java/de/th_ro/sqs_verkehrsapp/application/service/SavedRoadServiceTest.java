package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavedRoadServiceTest {

    @Mock
    private SavedRoadPort savedRoadPort;

    @InjectMocks
    private SavedRoadService savedRoadService;

    @Test
    void shouldSaveRoadForUser() {
        UUID userId = UUID.randomUUID();

        when(savedRoadPort.existsByUserIdAndRoadId(userId, "A8"))
                .thenReturn(false);

        when(savedRoadPort.save(any(SavedRoad.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SavedRoad result = savedRoadService.saveRoad(userId, "a8");

        assertThat(result.getUserId()).isEqualTo(userId);
        assertThat(result.getRoadId()).isEqualTo("A8");
        assertThat(result.getId()).isNotNull();

        ArgumentCaptor<SavedRoad> captor = ArgumentCaptor.forClass(SavedRoad.class);
        verify(savedRoadPort).save(captor.capture());

        assertThat(captor.getValue().getRoadId()).isEqualTo("A8");
    }

    @Test
    void shouldNotSaveDuplicateRoadForSameUser() {
        UUID userId = UUID.randomUUID();

        when(savedRoadPort.existsByUserIdAndRoadId(userId, "A8"))
                .thenReturn(true);

        assertThatThrownBy(() -> savedRoadService.saveRoad(userId, "A8"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bereits gespeichert");

        verify(savedRoadPort, never()).save(any());
    }

    @Test
    void shouldDeleteNormalizedRoadId() {
        UUID userId = UUID.randomUUID();

        savedRoadService.deleteRoad(userId, " a8 ");

        verify(savedRoadPort)
                .deleteByUserIdAndRoadId(userId, "A8");
    }
}