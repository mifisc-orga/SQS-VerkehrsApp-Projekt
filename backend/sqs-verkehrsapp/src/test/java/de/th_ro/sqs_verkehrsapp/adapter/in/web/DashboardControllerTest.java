package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.DashboardTrafficUseCase;
import de.th_ro.sqs_verkehrsapp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {

    private final MockMvc mockMvc;

    @MockitoBean
    private DashboardTrafficUseCase dashboardTrafficUseCase;

    @MockitoBean
    private JwtService jwtService; // required by security configuration in WebMvcTest context

    private static final String USER_ID = "11111111-1111-1111-1111-111111111111";

    private final UUID userId = UUID.fromString(USER_ID);

    private final Authentication authentication =
            new UsernamePasswordAuthenticationToken(USER_ID, null, List.of());

    @Autowired
    DashboardControllerTest(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    @WithMockUser(username = "11111111-1111-1111-1111-111111111111")
    void getSavedRoadTrafficShouldReturnTrafficForSavedRoadsOfAuthenticatedUser() throws Exception {
        when(dashboardTrafficUseCase.getTrafficForSavedRoads(userId))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/dashboard/saved-road-traffic").principal(authentication))
                .andExpect(status().isOk());

        verify(dashboardTrafficUseCase).getTrafficForSavedRoads(userId);
    }

}