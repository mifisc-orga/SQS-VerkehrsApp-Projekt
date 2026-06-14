package de.th_ro.sqs_verkehrsapp.adapter.in.web;

import de.th_ro.sqs_verkehrsapp.application.port.in.AuthUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import de.th_ro.sqs_verkehrsapp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    private MockMvc mockMvc;

    @MockitoBean
    private AuthUseCase authUseCase;

    @MockitoBean
    private JwtService jwtService;

    @Autowired
    AuthControllerTest(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    void registerShouldRegisterUserAndReturnToken() throws Exception {
        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(authUseCase.register("testuser", "password123"))
                .thenReturn(user);

        when(jwtService.generateToken(user))
                .thenReturn("test-jwt-token");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "testuser",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"));

        verify(authUseCase).register("testuser", "password123");
        verify(jwtService).generateToken(user);
    }

    @Test
    void loginShouldLoginUserAndReturnToken() throws Exception {
        AppUser user = AppUser.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .passwordHash("hashed-password")
                .build();

        when(authUseCase.login("testuser", "password123"))
                .thenReturn(user);

        when(jwtService.generateToken(user))
                .thenReturn("test-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "testuser",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"));

        verify(authUseCase).login("testuser", "password123");
        verify(jwtService).generateToken(user);
    }

    @Test
    void logoutShouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk());
    }

}