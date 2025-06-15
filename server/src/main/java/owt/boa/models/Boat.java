package owt.boa.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Entity representing a Boat in the system.
 * Inherits auditing features from {@link AuditableEntity}, such as createdBy and createdDate.
 */
@Entity
public class Boat extends AuditableEntity<Long> {

    /**
     * Primary key of the boat, auto-generated.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the boat.
     * Required and must not exceed 50 characters.
     */
    @NotEmpty(message = "name is required")
    @Size(max = 50, message = "name must not exceed 50 characters")
    private String name;

    /**
     * Description of the boat.
     * Required and must not exceed 300 characters.
     */
    @NotEmpty(message = "description is required")
    @Size(max = 300, message = "description must not exceed 300 characters")
    private String description;

    /**
     * URL to the image representing the boat.
     * Required and must not exceed 200 characters.
     */
    @NotEmpty(message = "imageUrl is required")
    @Size(max = 200, message = "imageUrl must not exceed 200 characters")
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Owner of the boat. Relationship with the {@link User} entity.
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;


    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }


    /**
     * Helper method to get the owner's last name if available.
     *
     * @return owner's last name, or empty string if owner is null.
     */
    public String getOwnerLastName() {
        return owner != null ? owner.getLastName() : "";
    }

    /**
     * Helper method to get the owner's first name if available.
     *
     * @return owner's first name, or empty string if owner is null.
     */
    public String getOwnerFirstName() {
        return owner != null ? owner.getFirstName() : "";
    }
}
