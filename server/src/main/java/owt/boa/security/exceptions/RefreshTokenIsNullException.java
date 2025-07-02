package owt.boa.security.exceptions;

public class RefreshTokenIsNullException extends RuntimeException {
    public RefreshTokenIsNullException(String message) {
        super(message);
    }
}

