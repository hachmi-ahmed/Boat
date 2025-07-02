package owt.boa.security;

import io.jsonwebtoken.ExpiredJwtException;
import owt.boa.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * A Spring Security filter responsible for intercepting HTTP requests,
 * validating JSON Web Tokens (JWTs) from the Authorization header,
 * and setting the authenticated user's security context.
 * This filter extends {@link OncePerRequestFilter} to ensure it runs only once per request.
 */
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private CustomUserDetailsService userDetailsService;

    /**
     * Constructs a new {@code JwtAuthorizationFilter}.
     *
     * @param jwtUtil An instance of {@link JwtUtil} for JWT-related operations (extraction, validation).
     * @param userDetailsService An instance of {@link CustomUserDetailsService} for loading user details from the database.
     */
    public JwtAuthorizationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Performs the internal filter logic to process the JWT.
     * <p>
     * This method:
     * <ol>
     * <li>Extracts the "Authorization" header from the request.</li>
     * <li>If the header is missing or does not start with "Bearer ", the filter chain proceeds without authentication.</li>
     * <li>Extracts the JWT from the header.</li>
     * <li>Extracts the username (typically email) from the JWT.</li>
     * <li>Loads user details using {@link CustomUserDetailsService#loadUserByUsername(String)}.</li>
     * <li>Validates the token against the loaded user details using {@link JwtUtil#isTokenValid(String, UserDetails)}.</li>
     * <li>If the token is valid, extracts the user's role, formats it to uppercase (e.g., "ROLE_ADMIN"),
     * and creates a {@link UsernamePasswordAuthenticationToken}.</li>
     * <li>Sets the created authentication token in the {@link SecurityContextHolder},
     * thereby authenticating the current request.</li>
     * <li>Catches any exceptions during token processing (e.g., invalid token, user not found) and clears the security context.</li>
     * <li>Finally, continues the filter chain.</li>
     * </ol>
     * </p>
     *
     * @param request The {@link HttpServletRequest} being processed.
     * @param response The {@link HttpServletResponse} for the current request.
     * @param filterChain The {@link FilterChain} to continue processing the request.
     * @throws ServletException If a servlet-specific error occurs.
     * @throws IOException If an I/O error occurs during the filter processing.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.replace("Bearer ", "");
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.isTokenValid(token, userDetails)) {
                String role = jwtUtil.extractRole(token);
                String formattedRole = role.toUpperCase();
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null,Collections.singletonList(new SimpleGrantedAuthority(formattedRole))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (ExpiredJwtException ex) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }
}
