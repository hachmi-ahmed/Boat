package owt.boa.controllers;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles; 
import owt.boa.models.Boat;
import owt.boa.services.BoatService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BoatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoatService boatService;

    private static final  String token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluQHRlc3QuY29tIiwiaWF0IjoxNzQ4NTEwNDM0LCJleHAiOjQ5MDIxMTA0MzR9.OZhiyGUHFEYTJWJTsB0aOVweVhNzlHZ03KUo4lvlJ5E";
    //"eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluQHRlc3QuY29tIiwiaWF0IjoxNzQ4MzYwODAyLCJleHAiOjE3NDg0NDcyMDJ9.XvETfnyw-0qGtYzkXZHlh8jyTT7gHeVRm-vQ3ThrGgU";


    @Test
    void testFindById_whenBoatExists_returnsBoat() throws Exception {
        Boat boat = new Boat();
        boat.setId(1L);
        boat.setName("Test Boat");

        Mockito.when(boatService.findById(1L)).thenReturn(Optional.of(boat));

        mockMvc.perform(get("/api/boats/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("API_BOAT.FOUND"))
                .andExpect(jsonPath("$.data.name").value("Test Boat"));
    }

    @Test
    void testFindById_whenBoatDoesNotExist_returnsNotFound() throws Exception {
        Mockito.when(boatService.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/boats/999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.key").value("API_BOAT.NOT_FOUND"));
    }

    @Test
    void testGetImageUrls_returnsImageList() throws Exception {
        mockMvc.perform(
                        get("/api/boats/image-urls")
                                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value(""))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testFindAll_returnsListOfBoats() throws Exception {
        Boat boat = new Boat();
        boat.setId(1L);
        boat.setName("Boat1");

        Mockito.when(boatService.findAll()).thenReturn(List.of(boat));

        mockMvc.perform(get("/api/boats").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value(""));
    }

}
