package owt.boa.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import owt.boa.commons.ApiResponse;
import owt.boa.commons.ApiResponseBuilder;
import owt.boa.repositories.BoatRepository;
import owt.boa.repositories.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatisticController {

    private UserRepository userRepository;

    private BoatRepository boatRepository;

    public StatisticController(UserRepository userRepository, BoatRepository boatRepository) {
        this.userRepository = userRepository;
        this.boatRepository = boatRepository;
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<Map<String, Long>>> getTranslations() {
        long userCount = this.userRepository.count();
        long boatCount = this.boatRepository.count();
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userCount);
        stats.put("totalBoats", boatCount);
        return ApiResponseBuilder.build(
                HttpStatus.OK, stats, "Find all boats images path", "API_BOAT.LIST_URLS_FOUND", false);
    }

}
