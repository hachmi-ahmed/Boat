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

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
         return ApiResponseBuilder.build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                null,
                "An unexpected error occurred : " +ex.getMessage(),
                "global.error",
                 true);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        String key = this.getValidationCodeFromValidationMessage(ex.getMessage());
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), key, true);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String key = this.getValidationCodeFromValidationMessage(ex.getMessage());
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), key, true);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFound(UserNotFoundException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.NOT_FOUND, null, ex.getMessage(), "USER_AUTH.LOGIN_USER_NOT_FOUND", true);
    }

    @ExceptionHandler(EmailAlreadyTakenException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserEmailTaken(EmailAlreadyTakenException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.BAD_REQUEST, null, ex.getMessage(), "USER_AUTH.REGISTER_EMAIL_TAKEN", true);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthFailure(AuthenticationException ex) {
        return ApiResponseBuilder.build(
                HttpStatus.UNAUTHORIZED, null, ex.getMessage(), "USER_AUTH.LOGIN_FAILED", true);
    }
    
    private String getValidationCodeFromValidationMessage(String message){
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
