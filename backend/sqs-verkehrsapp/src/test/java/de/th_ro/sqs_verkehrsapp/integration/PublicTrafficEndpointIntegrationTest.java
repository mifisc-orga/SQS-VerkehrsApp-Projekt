package de.th_ro.sqs_verkehrsapp.integration;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class PublicTrafficEndpointIntegrationTest {

    private final MockMvc mockMvc;

    @MockitoBean
    private AutobahnApiPort autobahnApiPort;

    @Autowired
    PublicTrafficEndpointIntegrationTest(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    void shouldAllowTrafficEndpointWithoutLogin() throws Exception {

        when(autobahnApiPort.getTrafficEvents("A8"))
                .thenReturn(new TrafficEventsResult(
                        List.of(),
                        true,
                        LocalDateTime.now(ZoneId.of("Europe/Berlin")),
                        0
                ));

        mockMvc.perform(get("/api/traffic/A8"))
                .andExpect(status().isOk());

        verify(autobahnApiPort).getTrafficEvents("A8");
    }
}
