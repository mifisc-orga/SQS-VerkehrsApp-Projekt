package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.out.UserPort;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserPort userPort;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    public void shouldRegisterUser() {
        when(userPort.existsByUsername("testuser"))
                .thenReturn(false);

        when(passwordEncoder.encode("test123"))
                .thenReturn("hashed-password");

        when(userPort.save(any(AppUser.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppUser result = authService.register("testuser", "test123");

        assertThat(result.getId()).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getPasswordHash()).isEqualTo("hashed-password");

        verify(userPort).save(any(AppUser.class));
    }

    @Test
    public void shouldNotRegisterExistingUsername() {
        when(userPort.existsByUsername("testuser"))
                .thenReturn(true);

        assertThatThrownBy(() -> authService.register("testuser", "test123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bereits vergeben");

        verify(userPort, never()).save(any());
    }

    @Test
    public void shouldLoginUser() {
        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(userPort.findByUsername("testuser"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("test123", "hashed-password"))
                .thenReturn(true);

        AppUser result = authService.login("testuser", "test123");

        assertThat(result).isEqualTo(user);
    }

    @Test
    public void shouldRejectWrongPassword() {
        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(userPort.findByUsername("testuser"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrong", "hashed-password"))
                .thenReturn(false);

        assertThatThrownBy(() -> authService.login("testuser", "wrong"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ungültige Login-Daten");
    }
}