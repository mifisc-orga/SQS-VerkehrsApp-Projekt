package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import de.th_ro.sqs_verkehrsapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {

        AppUser user = authUseCase.register(
                request.username(),
                request.password()
        );

        return new AuthResponse(jwtService.generateToken(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        AppUser user = authUseCase.login(
                request.username(),
                request.password()
        );

        return new AuthResponse(jwtService.generateToken(user));
    }

    public record AuthRequest(
            String username,
            String password
    ) {
    }

    public record AuthResponse(
            String token
    ) {
    }
}
