package de.th_ro.sqs_verkehrsapp.integration;


import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.UserRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class AuthSavedRoadIntegrationTest {

    private final MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final UserRepository userRepository;

    private final SavedRoadRepository savedRoadRepository;

    @MockitoBean
    private AutobahnApiPort autobahnApiPort;

    @Autowired
    AuthSavedRoadIntegrationTest(MockMvc mockMvc, UserRepository userRepository, SavedRoadRepository savedRoadRepository) {
        this.mockMvc = mockMvc;
        this.userRepository = userRepository;
        this.savedRoadRepository = savedRoadRepository;
    }

    @BeforeEach
    void cleanDatabase() {
        savedRoadRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterLoginSaveRoadAndGetDashboardTraffic() throws Exception {
        String token = registerUserAndExtractToken();

        saveRoad(token, "A8");
        assertSavedRoadExists(token, "A8");

        mockTrafficEvents("A8");

        assertDashboardContainsSavedRoadTraffic(token, "A8");

        verify(autobahnApiPort).getTrafficEvents("A8");
    }

    private String registerUserAndExtractToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "username": "testuser",
                              "password": "test123"
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(response)
                .get("token")
                .asText();

        assertThat(token).isNotBlank();
        return token;
    }

    private void saveRoad(String token, String roadId) throws Exception {
        mockMvc.perform(post("/api/saved-roads")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "roadId": "%s"
                            }
                            """.formatted(roadId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadId").value(roadId));
    }

    private void assertSavedRoadExists(String token, String roadId) throws Exception {
        mockMvc.perform(get("/api/saved-roads")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roadId").value(roadId));
    }

    private void mockTrafficEvents(String roadId) {
        when(autobahnApiPort.getTrafficEvents(roadId))
                .thenReturn(new TrafficEventsResult(
                        List.of(),
                        true,
                        LocalDateTime.now(ZoneId.of("Europe/Berlin")),
                        0
                ));
    }

    private void assertDashboardContainsSavedRoadTraffic(
            String token,
            String roadId
    ) throws Exception {
        mockMvc.perform(get("/api/dashboard/saved-road-traffic")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roadId").value(roadId))
                .andExpect(jsonPath("$[0].trafficEvents").exists())
                .andExpect(jsonPath("$[0].trafficEvents.riskScore").value(0));
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
