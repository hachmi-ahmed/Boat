package owt.boa.security.dtos;

import jakarta.validation.constraints.NotEmpty;
import owt.boa.models.enums.Role;

public class LoginRequest{
    @NotEmpty(message = "email is required")
    String email;
    @NotEmpty(message = "password is required")
    String password;
    Role role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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
}


