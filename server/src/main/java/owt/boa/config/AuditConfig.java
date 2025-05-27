package owt.boa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import owt.boa.models.User;

import java.util.Optional;

@Configuration
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            return Optional.ofNullable(
                            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                    )
                    .filter(auth -> auth.isAuthenticated() && auth.getPrincipal() instanceof User)
                    .map(auth -> ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername());
        };
    }
}
