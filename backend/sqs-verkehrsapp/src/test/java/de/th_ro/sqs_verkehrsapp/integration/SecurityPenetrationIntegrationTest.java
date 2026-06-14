package de.th_ro.sqs_verkehrsapp.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.UserEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityPenetrationIntegrationTest {

    private static final String USERNAME = "security-test-user";
    private static final String PASSWORD = "password";

    private final MockMvc mockMvc;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String validToken;

    @Autowired
    SecurityPenetrationIntegrationTest(
            MockMvc mockMvc,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.mockMvc = mockMvc;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteAll();

        userRepository.save(UserEntity.builder()
                .id(UUID.randomUUID())
                .username(USERNAME)
                .passwordHash(passwordEncoder.encode(PASSWORD))
                .build());

        validToken = loginAndExtractToken();
    }

    @Test
    void shouldRejectAccessToSavedRoadsWithoutToken() throws Exception {
        mockMvc.perform(get("/api/saved-roads"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectAccessToSavedRoadsWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/saved-roads")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectAccessToSavedRoadsWithMalformedAuthorizationHeader() throws Exception {
        mockMvc.perform(get("/api/saved-roads")
                        .header("Authorization", "Basic abcdef"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowAccessToSavedRoadsWithValidToken() throws Exception {
        mockMvc.perform(get("/api/saved-roads")
                        .header("Authorization", bearerToken()))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectSaveRoadWithoutToken() throws Exception {
        mockMvc.perform(post("/api/saved-roads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadId": "A1"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectSaveRoadWithInvalidToken() throws Exception {
        mockMvc.perform(post("/api/saved-roads")
                        .header("Authorization", "Bearer manipulated-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadId": "A1"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowSaveRoadWithValidToken() throws Exception {
        mockMvc.perform(post("/api/saved-roads")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadId": "A1"
                                }
                                """))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    void shouldRejectDeleteSavedRoadWithoutToken() throws Exception {
        mockMvc.perform(delete("/api/saved-roads/" + UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectDeleteSavedRoadWithInvalidToken() throws Exception {
        mockMvc.perform(delete("/api/saved-roads/" + UUID.randomUUID())
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReachDeleteEndpointWithValidToken() throws Exception {
        mockMvc.perform(delete("/api/saved-roads/" + UUID.randomUUID())
                        .header("Authorization", bearerToken()))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    void shouldAllowRegisterWithoutToken() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "new-security-user",
                                  "password": "password"
                                }
                                """))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    void shouldAllowLoginWithoutToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "security-test-user",
                                  "password": "password"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectLoginWithWrongPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "security-test-user",
                                  "password": "wrong-password"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    private String loginAndExtractToken() throws Exception {
        String responseBody = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "security-test-user",
                                  "password": "password"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(responseBody);

        return json.get("token").asText();
    }

    private String bearerToken() {
        return "Bearer " + validToken;
    }
}
