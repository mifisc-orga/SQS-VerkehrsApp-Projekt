package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import de.th_ro.sqs_verkehrsapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST controller responsible for user authentication.
 * Provides endpoints for user registration and login and
 * returns a JWT upon successful authentication.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtService jwtService;

    /**
     * Registers a new user and generates a JWT for the created account.
     *
     * @param request registration data containing username and password
     * @return response containing the generated JWT
     */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {

        AppUser user = authUseCase.register(
                request.username(),
                request.password()
        );

        return new AuthResponse(jwtService.generateToken(user));
    }

    /**
     * Logs in an existing user and generates a JWT Token.
     *
     * @param request login credentials containing username and password
     * @return response containing the generated JWT
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        AppUser user = authUseCase.login(
                request.username(),
                request.password()
        );

        return new AuthResponse(jwtService.generateToken(user));
    }

    /**
     * Handles user logout.
     * needs to be invalidated. Clients are expected to remove the stored token on logout.
     */
    @PostMapping("/logout")
    public void logout() {
        // JWT ist stateless:
        // Frontend löscht den Token.
    }

    /**
     * Request object used for registration and login operations.
     *
     * @param username user's username
     * @param password user's password
     */
    public record AuthRequest(
            String username,
            String password
    ) {
    }

    /**
     * Response object containing the generated JSON Web Token.
     *
     * @param token the JWT used for authentication in subsequent requests
     */
    public record AuthResponse(
            String token
    ) {
    }
}
