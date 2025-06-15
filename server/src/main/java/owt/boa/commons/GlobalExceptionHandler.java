package owt.boa.commons;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import owt.boa.security.exceptions.AuthenticationException;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import owt.boa.security.exceptions.UserNotFoundException;

/**
 * Global exception handler for the entire application.
 * Catches and processes exceptions thrown by REST controllers,
 * returning consistent API responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles all uncaught or generic exceptions.
     * Returns a 500 Internal Server Error with a global error message.
     *
     * @param ex the thrown exception
     * @return a standardized error response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        return ApiResponseBuilder.build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                null,
                "An unexpected error occurred : " + ex.getMessage(),
                "global.error",
                true);
    }

    /**
     * Handles validation errors related to constraint violations on request parameters or entities.
     *
     * @param ex the validation exception
     * @return a 400 Bad Request response with a specific validation error key
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        String key = this.getValidationCodeFromValidationMessage(ex.getMessage());
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), key, true);
    }

    /**
     * Handles validation errors for method arguments annotated with @Valid.
     *
     * @param ex the validation exception
     * @return a 400 Bad Request response with a specific validation error key
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String key = this.getValidationCodeFromValidationMessage(ex.getMessage());
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), key, true);
    }

    /**
     * Handles the case when a user is not found during authentication.
     *
     * @param ex the exception indicating the user was not found
     * @return a 404 Not Found response
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFound(UserNotFoundException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.NOT_FOUND, null, ex.getMessage(), "USER_AUTH.LOGIN_USER_NOT_FOUND", true);
    }

    /**
     * Handles the case when a user tries to register with an already taken email.
     *
     * @param ex the exception indicating the email is already taken
     * @return a 400 Bad Request response
     */
    @ExceptionHandler(EmailAlreadyTakenException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserEmailTaken(EmailAlreadyTakenException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), "USER_AUTH.REGISTER_EMAIL_TAKEN", true);
    }

    /**
     * Handles authentication failures (e.g., wrong credentials).
     *
     * @param ex the authentication failure exception
     * @return a 401 Unauthorized response
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthFailure(AuthenticationException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.UNAUTHORIZED, null, ex.getMessage(), "USER_AUTH.LOGIN_FAILED", true);
    }

    /**
     * Helper method to convert exception messages to internal validation message keys.
     *
     * @param message the exception message
     * @return a message key that corresponds to a translatable validation message
     */
    private String getValidationCodeFromValidationMessage(String message) {
        if (message.contains("name")) {
            return "VALIDATION.BOAT_NAME";
        } else if (message.contains("description")) {
            return "VALIDATION.BOAT_DESCRIPTION";
        } else if (message.contains("imageUrl")) {
            return "VALIDATION.BOAT_IMAGE_URL";
        } else if (message.contains("email")) {
            return "VALIDATION.USER_EMAIL";
        } else if (message.contains("firstName")) {
            return "VALIDATION.USER_FIRSTNAME";
        } else if (message.contains("lastName")) {
            return "VALIDATION.USER_LASTNAME";
        } else {
            return "VALIDATION.UNKNOWN_FIELD";
        }
    }
}
