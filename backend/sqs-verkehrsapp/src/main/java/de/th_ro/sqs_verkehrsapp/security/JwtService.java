package de.th_ro.sqs_verkehrsapp.security;

import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * Service for creating and validating JSON Web Tokens (JWT).
 * <p>
 * Provides functionality for generating authentication tokens,
 * extracting user information, and validating token expiration.
 */
@Component
public class JwtService {

    /**
     * Secret key used to sign and verify JWT tokens.
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Expiration time of a JWT token in milliseconds.
     */
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /**
     * Creates the signing key used for JWT generation and validation.
     *
     * @return the signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a JWT token for the specified user.
     *
     * @param user the authenticated user
     * @return the generated JWT token
     */
    public String generateToken(AppUser user) {

        Instant now = Instant.now();
        Instant expiresAt = now.plusMillis(EXPIRATION_TIME);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("username", user.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the user identifier from a JWT token.
     *
     * @param token the JWT token
     * @return the user identifier contained in the token
     */
    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaims(token).getSubject());
    }

    /**
     * Validates whether a JWT token is still valid.
     *
     * @param token the JWT token
     * @return {@code true} if the token is valid and not expired,
     *         {@code false} otherwise
     */
    public boolean isTokenValid(String token) {
        return extractClaims(token)
                .getExpiration()
                .toInstant()
                .isAfter(Instant.now());
    }

    /**
     * Extracts the claims contained in a JWT token.
     *
     * @param token the JWT token
     * @return the token claims
     */
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
