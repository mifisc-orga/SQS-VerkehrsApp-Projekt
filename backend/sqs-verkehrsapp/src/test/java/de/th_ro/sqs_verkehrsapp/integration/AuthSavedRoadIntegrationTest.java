package de.th_ro.sqs_verkehrsapp.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.SavedRoadRepository;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.UserRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class AuthSavedRoadIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AutobahnApiPort autobahnApiPort;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavedRoadRepository savedRoadRepository;

    @BeforeEach
    void cleanDatabase() {
        savedRoadRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void shouldRegisterLoginSaveRoadAndGetDashboardTraffic() throws Exception {

        String registerResponse = mockMvc.perform(post("/api/auth/register")
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

        String token = objectMapper.readTree(registerResponse)
                .get("token")
                .asText();

        assertThat(token).isNotBlank();

        mockMvc.perform(post("/api/saved-roads")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadId": "A8"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadId").value("A8"));

        mockMvc.perform(get("/api/saved-roads")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roadId").value("A8"));

        when(autobahnApiPort.getTrafficEvents("A8"))
                .thenReturn(new TrafficEventsResult(
                        List.of(),
                        true,
                        LocalDateTime.now(),
                        0
                ));

        mockMvc.perform(get("/api/dashboard/saved-road-traffic")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roadId").value("A8"))
                .andExpect(jsonPath("$[0].trafficEvents").exists())
                .andExpect(jsonPath("$[0].trafficEvents.riskScore").value(0));

        verify(autobahnApiPort).getTrafficEvents("A8");
    }
}
