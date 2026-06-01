package de.th_ro.sqs_verkehrsapp.application.service;


import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.UserPort;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {

    private final UserPort userPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser register(String username, String password) {

        if (userPort.existsByUsername(username)) {
            throw new IllegalArgumentException("Username ist bereits vergeben");
        }

        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username(username)
                .passwordHash(passwordEncoder.encode(password))
                .build();

        return userPort.save(user);
    }

    @Override
    public AppUser login(String username, String password) {

        AppUser user = userPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Ungültige Login-Daten"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Ungültige Login-Daten");
        }

        return user;
    }
}
