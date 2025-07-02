package owt.boa.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import owt.boa.models.User;
import owt.boa.models.enums.Role;
import owt.boa.repositories.UserRepository;
import owt.boa.security.dtos.LoginRequest;
import owt.boa.security.dtos.LoginResponse;
import owt.boa.security.dtos.RegisterRequest;
import owt.boa.security.exceptions.AuthenticationException;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import owt.boa.security.exceptions.RefreshTokenInvalidException;
import owt.boa.security.exceptions.UserNotFoundException;
import owt.boa.services.TokenService;
import owt.boa.utils.JwtUtil;

/**
 * Service class responsible for handling user authentication and registration logic.
 * Provides methods to register new users and authenticate existing ones using Spring Security.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenService tokenService;

    /**
     * Constructs the AuthService with required dependencies.
     *
     * @param userRepository        Repository for managing user data.
     * @param passwordEncoder       Encoder used for securely hashing passwords.
     * @param authenticationManager Spring Security's authentication manager.
     * @param jwtUtil               Utility for generating JWT tokens.
     * @param tokenService       Repository for managing user token
     */
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.tokenService = tokenService;
    }

    /**
     * Registers a new user if the email is not already taken.
     *
     * @param request Object containing the user's registration data.
     * @throws EmailAlreadyTakenException if the provided email is already registered.
     */
    public void registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyTakenException("Email is already taken");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);
    }

    /**
     * Authenticates a user and returns a response with user details and JWT token.
     *
     * @param request      Object containing login credentials.
     * @param httpResponse
     * @return A LoginResponse containing the authenticated user's info and JWT token.
     * @throws AuthenticationException if authentication fails.
     * @throws UserNotFoundException   if the authenticated user's data cannot be found.
     */
    public LoginResponse authenticate(LoginRequest request, HttpServletResponse httpResponse) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername());
            if (user == null) {
                throw new UserNotFoundException("User not found");
            }
            Role role = user.getRole();
            String token = jwtUtil.generateAccessToken(userDetails, role);

            String refreshToken = jwtUtil.generateRefreshToken(user);
            tokenService.saveToken(refreshToken, user.getUsername());
            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/api/auth/");
            cookie.setMaxAge(request.isRememberMe() ? 30 * 24 * 60 * 60 : -1);
            httpResponse.addCookie(cookie);

            return new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    token,
                    role
            );
        } catch (Exception e) {
            throw new AuthenticationException("Authentication failed : " + e.getMessage());
        }
    }

    public LoginResponse generateNewAccessToken(String refreshToken){
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username);
        if (!jwtUtil.isTokenValid(refreshToken, user) || !this.tokenService.validateRefreshTokenInDb(refreshToken)) {
            throw new RefreshTokenInvalidException("Refresh token is invalid");
        }
        Role role = user.getRole();
        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                jwtUtil.generateAccessToken(user, role),
                role
        );

    }

    @Transactional
    public void deleteToken(String refreshToken) {
        this.tokenService.deleteToken(refreshToken);
    }
}
