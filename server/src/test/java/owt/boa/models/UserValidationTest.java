package owt.boa.models;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import owt.boa.models.enums.Role;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class UserValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenEmailIsEmpty_thenConstraintViolation() {
        User user = new User();
        user.setEmail(""); // Empty email
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("email") &&
                v.getMessage().equals("email is required"));
    }

    @Test
    void whenEmailIsInvalidFormat_thenConstraintViolation() {
        User user = new User();
        user.setEmail("invalid-email"); // Invalid format
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("email") &&
                v.getMessage().equals("must be a well-formed email address"));

    }

    @Test
    void whenEmailExceedsMaxLength_thenConstraintViolation() {
        User user = new User();
        user.setEmail("a".repeat(45) + "@example.com"); // 45 + 11 = 56 characters, exceeds 50
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("email") &&
                v.getMessage().contains("must not exceed 50 characters"));
    }

    @Test
    void whenEmailIsValid_thenNoConstraintViolation() {
        User user = new User();
        user.setEmail("test@example.com"); // Valid email
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setPassword("securepassword");
        user.setRole(Role.ROLE_ADMIN);

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertThat(violations).isEmpty();
    }
}
