package owt.boa.services;

import org.springframework.stereotype.Service;
import owt.boa.models.RefreshToken;
import owt.boa.repositories.TokenRepository;
import owt.boa.security.exceptions.RefreshTokenInvalidException;

import java.time.Duration;
import java.time.OffsetDateTime;

/**
 * Service class responsible for managing Boat-related operations.
 * Handles creating, retrieving, and deleting boats, and associates boats with users.
 */
@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    public void saveToken(String token, String username) {
        final RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(OffsetDateTime.now().plus(Duration.ofMinutes(60)));
        refreshToken.setUsername(username);
        tokenRepository.save(refreshToken);
    }

    public boolean validateRefreshTokenInDb(final String token) {
        final RefreshToken refreshToken = tokenRepository.findByTokenAndExpiryDateAfter(token, OffsetDateTime.now());
        if (refreshToken == null) {
            throw new RefreshTokenInvalidException("Refresh token invalid");
        }else {
            return !refreshToken.isRevoked();
        }
    }

    public void deleteToken(String refreshToken) {
        this.tokenRepository.deleteByToken(refreshToken);
    }
}
