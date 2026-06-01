package de.th_ro.sqs_verkehrsapp.integration;

import de.th_ro.sqs_verkehrsapp.application.port.out.AutobahnApiPort;
import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class PublicTrafficEndpointIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AutobahnApiPort autobahnApiPort;

    @Test
    public void shouldAllowTrafficEndpointWithoutLogin() throws Exception {

        when(autobahnApiPort.getTrafficEvents("A8"))
                .thenReturn(new TrafficEventsResult(
                        List.of(),
                        true,
                        LocalDateTime.now(),
                        0
                ));

        mockMvc.perform(get("/api/traffic/A8"))
                .andExpect(status().isOk());

        verify(autobahnApiPort).getTrafficEvents("A8");
    }
}
