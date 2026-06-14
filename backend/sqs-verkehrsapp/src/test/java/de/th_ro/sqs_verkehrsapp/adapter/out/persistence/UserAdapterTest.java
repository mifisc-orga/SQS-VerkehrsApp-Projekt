package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.UserEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.UserRepository;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserAdapterTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserAdapter adapter;

    @Test
    void save_shouldMapDomainToEntityAndReturnSavedDomainObject() {
        UUID id = UUID.randomUUID();

        AppUser user = AppUser.builder()
                .id(id)
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        UserEntity savedEntity = UserEntity.builder()
                .id(id)
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(repository.save(any(UserEntity.class))).thenReturn(savedEntity);

        AppUser result = adapter.save(user);

        ArgumentCaptor<UserEntity> captor =
                ArgumentCaptor.forClass(UserEntity.class);

        verify(repository).save(captor.capture());

        UserEntity captured = captor.getValue();

        assertThat(captured.getId()).isEqualTo(id);
        assertThat(captured.getUsername()).isEqualTo("testuser");
        assertThat(captured.getPasswordHash()).isEqualTo("hashed-password");

        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getPasswordHash()).isEqualTo("hashed-password");
    }

    @Test
    void findByUsername_shouldReturnMappedUserWhenUserExists() {
        UUID id = UUID.randomUUID();

        UserEntity entity = UserEntity.builder()
                .id(id)
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(repository.findByUsername("testuser"))
                .thenReturn(Optional.of(entity));

        Optional<AppUser> result = adapter.findByUsername("testuser");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(id);
        assertThat(result.get().getUsername()).isEqualTo("testuser");
        assertThat(result.get().getPasswordHash()).isEqualTo("hashed-password");
    }

    @Test
    void findByUsername_shouldReturnEmptyWhenUserDoesNotExist() {
        when(repository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        Optional<AppUser> result = adapter.findByUsername("unknown");

        assertThat(result).isEmpty();
    }

    @Test
    void existsByUsername_shouldReturnTrueWhenRepositoryReturnsTrue() {
        when(repository.existsByUsername("testuser"))
                .thenReturn(true);

        boolean result = adapter.existsByUsername("testuser");

        assertThat(result).isTrue();
    }

    @Test
    void existsByUsername_shouldReturnFalseWhenRepositoryReturnsFalse() {
        when(repository.existsByUsername("unknown"))
                .thenReturn(false);

        boolean result = adapter.existsByUsername("unknown");

        assertThat(result).isFalse();
    }

}