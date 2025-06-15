package owt.boa.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import owt.boa.services.BoatService;

@TestConfiguration
public class BoatControllerTestConfig {

    @Bean
    public BoatService boatService() {
        return Mockito.mock(BoatService.class);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
