package owt.boa.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import owt.boa.security.AuthService;
import owt.boa.security.dtos.LoginRequest;
import owt.boa.security.dtos.LoginResponse;
import owt.boa.security.dtos.RegisterRequest;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should register user successfully")
    void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("securePassword");
        request.setRole(owt.boa.models.enums.Role.ROLE_USER);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.key").value("USER_AUTH.REGISTER_SUCCESS"));
    }

    @Test
    @DisplayName("Should return error if email already taken")
    void shouldReturnEmailTakenError() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("duplicate@example.com");
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setPassword("password");
        request.setRole(owt.boa.models.enums.Role.ROLE_USER);

        Mockito.doThrow(new EmailAlreadyTakenException("Email is already taken"))
                .when(authService).registerUser(any(RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Email is already taken"))
                .andExpect(jsonPath("$.key").value("USER_AUTH.REGISTER_EMAIL_TAKEN"));
    }

    @Test
    @DisplayName("Should authenticate user successfully")
    void shouldAuthenticateUserSuccessfully() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        LoginResponse loginResponse = new LoginResponse(1L, "test@example.com", "John", "Doe", "fake-jwt-token", owt.boa.models.enums.Role.ROLE_USER);

        Mockito.when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User login successfully"))
                .andExpect(jsonPath("$.key").value("USER_AUTH.LOGIN_SUCCESS"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.token").value("fake-jwt-token"));
    }
}
