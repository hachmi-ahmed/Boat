package owt.boa.security.exceptions;

public class RefreshTokenInvalidException extends RuntimeException {
    public RefreshTokenInvalidException(String message) {
        super(message);
    }
}

