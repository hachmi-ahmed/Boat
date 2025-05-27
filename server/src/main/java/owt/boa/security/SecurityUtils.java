package owt.boa.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import owt.boa.models.User;
import owt.boa.security.exceptions.UserNotFoundException;


public class SecurityUtils {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            user = ((User) authentication.getPrincipal());
        }
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        return user;
    }
}
