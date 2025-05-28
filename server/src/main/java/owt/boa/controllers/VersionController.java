package owt.boa.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VersionController {

    @Value("${project.version}")
    private String version;

    @GetMapping("/api/public/version")
    public String getVersion() {
        return version;
    }
}
