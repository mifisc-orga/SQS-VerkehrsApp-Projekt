package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.SavedRoadUseCase;
import de.th_ro.sqs_verkehrsapp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SavedRoadController.class)
@AutoConfigureMockMvc(addFilters = false)
class SavedRoadControllerTest {

    private final MockMvc mockMvc;

    @MockitoBean
    private SavedRoadUseCase savedRoadUseCase;

    @MockitoBean
    private JwtService jwtService; // required by security configuration in WebMvcTest context

    private static final String USER_ID = "11111111-1111-1111-1111-111111111111";

    private final UUID userId = UUID.fromString(USER_ID);

    private final Authentication authentication =
            new UsernamePasswordAuthenticationToken(USER_ID, null, List.of());

    @Autowired
    SavedRoadControllerTest (MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    void saveRoadShouldSaveRoadForAuthenticatedUser() throws Exception {
        String roadId = "A8";

        mockMvc.perform(post("/api/saved-roads")
                        .principal(authentication)
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "roadId": "A8"
                                }
                                """))
                .andExpect(status().isOk());

        verify(savedRoadUseCase).saveRoad(userId, roadId);
    }

    @Test
    void getSavedRoadsShouldReturnSavedRoadsForAuthenticatedUser() throws Exception {
        when(savedRoadUseCase.getSavedRoads(userId))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/saved-roads") .principal(authentication))
                .andExpect(status().isOk());

        verify(savedRoadUseCase).getSavedRoads(userId);
    }

    @Test
    void deleteRoadShouldDeleteSavedRoadForAuthenticatedUser() throws Exception {
        String roadId = "A8";

        mockMvc.perform(delete("/api/saved-roads/{roadId}", roadId) .principal(authentication))
                .andExpect(status().isOk());

        verify(savedRoadUseCase).deleteRoad(userId, roadId);
    }

}