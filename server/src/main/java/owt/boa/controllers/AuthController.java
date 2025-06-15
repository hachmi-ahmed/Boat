package owt.boa.controllers;

import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import owt.boa.commons.ApiResponse;
import owt.boa.commons.ApiResponseBuilder;
import owt.boa.security.AuthService;
import owt.boa.security.dtos.LoginRequest;
import owt.boa.security.dtos.LoginResponse;
import owt.boa.security.dtos.RegisterRequest;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return ApiResponseBuilder.build(
                    HttpStatus.OK, null, "User registered successfully", "USER_AUTH.REGISTER_SUCCESS", true);
        } catch (EmailAlreadyTakenException e) {
            return ApiResponseBuilder.build(
                    HttpStatus.BAD_REQUEST, null, e.getMessage(), "USER_AUTH.REGISTER_EMAIL_TAKEN", true);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticate(request);
        return ApiResponseBuilder.build(
                HttpStatus.OK, response, "User login successfully", "USER_AUTH.LOGIN_SUCCESS", true);
    }

}
