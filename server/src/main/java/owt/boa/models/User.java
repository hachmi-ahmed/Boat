package owt.boa.models;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import owt.boa.models.enums.Role;

/**
 * Entity class representing an application user.
 *
 * This class extends {@link AuditableEntity} to automatically manage auditing fields
 * like createdBy, createdDate, etc., using Spring Data JPA auditing.
 *
 * It also implements {@link UserDetails} to integrate with Spring Security.
 */
@Entity
@Table(name = "app_user")
public class User extends AuditableEntity<Long> implements UserDetails {

    /**
     * Primary key of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email address of the user.
     * Must be a valid email format, not empty, and max 50 characters.
     */
    @NotEmpty(message = "email is required")
    @Email
    @Size(max = 50, message = "email must not exceed 50 characters")
    private String email;

    /**
     * User's first name. Required and max 50 characters.
     */
    @NotEmpty(message = "firstName is required")
    @Size(max = 50, message = "firstName must not exceed 50 characters")
    private String firstName;

    /**
     * User's last name. Required and max 50 characters.
     */
    @NotEmpty(message = "lastName is required")
    @Size(max = 50, message = "lastName must not exceed 50 characters")
    private String lastName;

    /**
     * Password for authentication.
     * Marked with @JsonIgnore to prevent serialization in JSON responses.
     */
    @JsonIgnore
    private String password;

    /**
     * User's role, stored as an enum (ROLE_ADMIN, ROLE_USER).
     * Cannot be null.
     */
    @Enumerated(EnumType.STRING)
    @NotNull
    private Role role;

    public User() {}

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    /**
     * Returns the authorities granted to the user.
     * This implementation returns a single role as the authority.
     */
    @Override
    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new LinkedHashSet<>();
        authorities.add(this.getRole()); // Role enum implements GrantedAuthority
        return authorities;
    }

    /**
     * Returns the username used for authentication (in this case, the email).
     */
    @Override
    @Transient
    public String getUsername() {
        return this.getEmail();
    }

    /**
     * Indicates whether the user's account has expired.
     * Always true for simplicity; extend if needed.
     */
    @Override
    @Transient
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is locked or unlocked.
     * Always true for simplicity; extend if needed.
     */
    @Override
    @Transient
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials (password) has expired.
     * Always true for simplicity; extend if needed.
     */
    @Override
    @Transient
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
