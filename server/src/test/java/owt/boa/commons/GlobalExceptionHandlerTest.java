package owt.boa.commons;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import owt.boa.security.exceptions.AuthenticationException;
import owt.boa.security.exceptions.EmailAlreadyTakenException;
import owt.boa.security.exceptions.UserNotFoundException;

import java.lang.reflect.Method;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler globalExceptionHandler;
    private static Validator validator;

    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
        if (validator == null) {
            validator = Validation.buildDefaultValidatorFactory().getValidator();
        }
    }

    @Test
    void handleGenericException_shouldReturnInternalServerError() {
        Exception ex = new RuntimeException("Something went wrong");

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleGenericException(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(500);
        assertThat(responseEntity.getBody().getMessage()).contains("An unexpected error occurred");
        assertThat(responseEntity.getBody().getMessage()).contains("Something went wrong");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("global.error");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    @Test
    void handleConstraintViolationException_shouldReturnBadRequest_withBoatNameKey() {
        Set<ConstraintViolation<BoatDto>> violations = new HashSet<>();
        violations.add(validator.validateProperty(new BoatDto(), "name").iterator().next());
        ConstraintViolationException ex = new ConstraintViolationException("name is required", violations);

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleConstraintViolationException(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(400);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("name is required");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("VALIDATION.BOAT_NAME");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    @Test
    void handleConstraintViolationException_shouldReturnBadRequest_withUserEmailKey() {
        Set<ConstraintViolation<Object>> violations = new HashSet<>();
        ConstraintViolationException ex = new ConstraintViolationException("email is invalid", violations);

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleConstraintViolationException(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(400);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("email is invalid");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("VALIDATION.USER_EMAIL");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    @Test
    void handleConstraintViolationException_shouldReturnBadRequest_withUnknownFieldKey() {
        Set<ConstraintViolation<Object>> violations = new HashSet<>();
        ConstraintViolationException ex = new ConstraintViolationException("someOtherField is bad", violations);

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleConstraintViolationException(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(400);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("someOtherField is bad");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("VALIDATION.UNKNOWN_FIELD");
        assertThat(responseEntity.getBody().getData()).isNull();
    }


    @Test
    void handleMethodArgumentNotValidException_shouldReturnBadRequest_withBoatDescriptionKey() throws NoSuchMethodException {
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getAllErrors())
                .thenReturn(Collections.singletonList(new FieldError("boatDto", "description", "description is too short")));
        class DummyController {
            public void dummyMethod(@jakarta.validation.Valid BoatDto dto, BindingResult result) {}
        }
        Method dummyMethod = DummyController.class.getMethod("dummyMethod", BoatDto.class, BindingResult.class);
        MethodParameter methodParameter = new MethodParameter(dummyMethod, 0);

        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(methodParameter, bindingResult);


        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleMethodArgumentNotValidException(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(400);
        assertThat(((ApiResponse<?>) responseEntity.getBody()).getMessage()).contains("description is too short");
        assertThat(((ApiResponse<?>) responseEntity.getBody()).getKey()).isEqualTo("VALIDATION.BOAT_DESCRIPTION");
        assertThat(((ApiResponse<?>) responseEntity.getBody()).getData()).isNull();
    }




    @Test
    void handleUserNotFound_shouldReturnNotFound() {
        UserNotFoundException ex = new UserNotFoundException("User with email not found");

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleUserNotFound(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(404);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("User with email not found");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("USER_AUTH.LOGIN_USER_NOT_FOUND");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    @Test
    void handleUserEmailTaken_shouldReturnBadRequest() {
        EmailAlreadyTakenException ex = new EmailAlreadyTakenException("Email already registered");

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleUserEmailTaken(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(400);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("Email already registered");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("USER_AUTH.REGISTER_EMAIL_TAKEN");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    @Test
    void handleAuthFailure_shouldReturnUnauthorized() {
        AuthenticationException ex = new AuthenticationException("Invalid credentials");

        ResponseEntity<ApiResponse<Object>> responseEntity = globalExceptionHandler.handleAuthFailure(ex);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getStatus()).isEqualTo(401);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("Invalid credentials");
        assertThat(responseEntity.getBody().getKey()).isEqualTo("USER_AUTH.LOGIN_FAILED");
        assertThat(responseEntity.getBody().getData()).isNull();
    }

    // Helper DTO for validation tests
    public static class BoatDto {
        @jakarta.validation.constraints.NotBlank(message = "name is required")
        private String name;
        @jakarta.validation.constraints.Size(min = 10, message = "description is too short")
        private String description;
        private String imageUrl;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}
