package owt.boa.services;

import org.springframework.stereotype.Service;
import owt.boa.models.Boat;
import owt.boa.models.User;
import owt.boa.repositories.BoatRepository;
import owt.boa.repositories.UserRepository;
import owt.boa.security.exceptions.UserNotFoundException;

import java.util.List;
import java.util.Optional;

/**
 * Service class responsible for managing Boat-related operations.
 * Handles creating, retrieving, and deleting boats, and associates boats with users.
 */
@Service
public class BoatService {

    private final BoatRepository boatRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a new BoatService with the given repositories.
     *
     * @param boatRepository Repository for Boat entities.
     * @param userRepository Repository for User entities.
     */
    public BoatService(BoatRepository boatRepository, UserRepository userRepository) {
        this.boatRepository = boatRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new boat and assigns it to a user by their ID.
     *
     * @param boat   The boat to be created.
     * @param userId The ID of the user who owns the boat.
     * @return The saved Boat entity.
     * @throws UserNotFoundException if the user with the given ID does not exist.
     */
    public Boat createBoat(Boat boat, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFoundException("User not found");
        }
        boat.setOwner(user.get());
        return this.boatRepository.saveAndFlush(boat);
    }

    /**
     * Finds a boat by its ID.
     *
     * @param id The ID of the boat.
     * @return An Optional containing the boat if found, or empty otherwise.
     */
    public Optional<Boat> findById(Long id) {
        return this.boatRepository.findById(id);
    }

    /**
     * Retrieves all boats, sorted by creation date in descending order.
     *
     * @return A list of all boats.
     */
    public List<Boat> findAll() {
        return this.boatRepository.findAllByOrderByCreatedDateDesc();
    }

    /**
     * Finds all boats associated with a specific user ID.
     *
     * @param userId The ID of the user.
     * @return A list of boats owned by the user.
     */
    public List<Boat> findAllByUserId(Long userId) {
        return this.boatRepository.findByUserId(userId);
    }

    /**
     * Deletes a boat by its ID.
     *
     * @param id The ID of the boat to delete.
     */
    public void deleteById(Long id) {
        this.boatRepository.deleteById(id);
    }
}
