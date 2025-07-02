package owt.boa.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import owt.boa.commons.ApiResponse;
import owt.boa.commons.ApiResponseBuilder;
import owt.boa.security.dtos.LoginRequest;
import owt.boa.security.dtos.LoginResponse;
import owt.boa.security.dtos.RegisterRequest;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import owt.boa.security.exceptions.RefreshTokenIsNullException;

import java.util.Arrays;

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
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest request, HttpServletResponse httpResponse) {
        LoginResponse response = authService.authenticate(request, httpResponse);

        return ApiResponseBuilder.build(
                HttpStatus.OK, response, "User login successfully", "USER_AUTH.LOGIN_SUCCESS", true);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        Cookie cookie = Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst().orElse(null);
        if (cookie == null) throw new RefreshTokenIsNullException("Refresh token is null");

        String refreshToken = cookie.getValue();
        LoginResponse loginResponse = this.authService.generateNewAccessToken(refreshToken);

        return ApiResponseBuilder.build(
                HttpStatus.OK, loginResponse, "Token refresh successfully", "USER_AUTH.TOKEN_REFRESH_SUCCESS", false);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst().orElse(null);
        if (cookie == null) throw new RefreshTokenIsNullException("Refresh token is invalid or null");
        String refreshToken = cookie.getValue();
        this.authService.deleteToken(refreshToken);

        cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ApiResponseBuilder.build(
                HttpStatus.OK, null, "Logout successfully", "USER_AUTH.LOGOUT_SUCCESS", false);
    }

}
