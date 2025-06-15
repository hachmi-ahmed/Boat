package owt.boa.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import owt.boa.commons.ApiResponse;
import owt.boa.commons.ApiResponseBuilder;
import owt.boa.models.Boat;
import owt.boa.models.User;
import owt.boa.models.dtos.BoatDto;
import owt.boa.security.SecurityUtils;
import owt.boa.services.BoatService;

import java.util.List;

@RestController
@RequestMapping("/api/boats")
@Validated
public class BoatController {

    private BoatService boatService;

    private ObjectMapper mapper;

    public BoatController(BoatService boatService, ObjectMapper mapper) {
        this.boatService = boatService;
        this.mapper = mapper;
    }

    @PostMapping
    @RolesAllowed({"ROLE_ADMIN", "ROLE_USER"})
    public ResponseEntity<?> createBoat(@Valid @RequestBody BoatDto boat) {
        Long userId;
        User user;
        // Check that the owner of the entity is not changed when Admin perform update
        // New entity always owned by the authenticated user
        // Existing entity, get userId from frontend
        if (boat.getId() == -1) {
            user = SecurityUtils.getCurrentUser();
            boat.setId(null);
            userId= user.getId();
        }else{
            userId = boat.getUserId();
        }
        Boat saved = boatService.createBoat(this.mapper.convertValue(boat, Boat.class), userId);
        return ApiResponseBuilder.build(
                HttpStatus.OK, this.mapper.convertValue(saved, BoatDto.class),
                "Boat saved successfully", "API_BOAT.CREATED_SUCCESS", true);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Boat>> findById(@PathVariable("id") Long id) {
        return boatService.findById(id)
                .map(boat -> ApiResponseBuilder.build(
                        HttpStatus.OK, boat, "Boat found", "API_BOAT.FOUND", false))
                .orElseGet(() -> ApiResponseBuilder.build(
                        HttpStatus.NOT_FOUND, null, "Boat not found", "API_BOAT.NOT_FOUND", true));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoatDto>>> findAll() {
        List<Boat> boats = boatService.findAll();
        return ApiResponseBuilder.build(
                HttpStatus.OK, this.mapToDtos(boats), "", "", false);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<List<BoatDto>>> findAllByUserId(@PathVariable("userId") Long userId) {
        List<Boat> boats = boatService.findAllByUserId(userId);
        return ApiResponseBuilder.build(
                HttpStatus.OK, this.mapToDtos(boats), "", "", false);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteById(@PathVariable("id") Long id) {
        this.boatService.deleteById(id);
        return ApiResponseBuilder.build(
                HttpStatus.OK, null, "Boat was deleted", "API_BOAT.DELETED", true);
    }

    @GetMapping("/image-urls")
    public ResponseEntity<ApiResponse<List<String>>> getImageUrls() {
        return ApiResponseBuilder.build(
                HttpStatus.OK, urls(), "", "", false);
    }

    private List<BoatDto> mapToDtos(List<Boat> boats) {
        return this.mapper.convertValue(boats, new TypeReference<List<BoatDto>>() {
        });
    }

    private List<String> urls() {
        return List.of(
                "assets/img/pexels-blitzboy-1106423.jpg",
                "assets/img/pexels-frans-van-heerden-201846-625418.jpg",
                "assets/img/pexels-goumbik-296278.jpg",
                "assets/img/pexels-hakantahmaz-2536643.jpg",
                "assets/img/pexels-korhan-erdol-1123380-2344572.jpg",
                "assets/img/pexels-lecreusois-240561.jpg",
                "assets/img/pexels-mali-42092.jpg",
                "assets/img/pexels-md-towhidul-islam-175863-3013018.jpg",
                "assets/img/pexels-mikebirdy-996328.jpg",
                "assets/img/pexels-minan1398-715567.jpg",
                "assets/img/pexels-nuno-obey-34504-128302.jpg",
                "assets/img/pexels-photoklickr-78359-244517.jpg",
                "assets/img/pexels-pixabay-33545.jpg",
                "assets/img/pexels-pixabay-33689.jpg",
                "assets/img/pexels-pixabay-86699.jpg",
                "assets/img/pexels-pixabay-261516.jpg",
                "assets/img/pexels-pixabay-271681.jpg",
                "assets/img/pexels-rafa-de-21730-1471724.jpg",
                "assets/img/pexels-roman-odintsov-6585322.jpg",
                "assets/img/pexels-sevenstormphotography-575890.jpg",
                "assets/img/pexels-vincent-gerbouin-445991-1167023.jpg"
        );
    }
}
