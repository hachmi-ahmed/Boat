package owt.boa.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity
public class Boat extends AuditableEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "name is required")
    @Size(max = 50, message = "name must not exceed 50 characters")
    private String name;

    @NotEmpty(message = "description is required")
    @Size(max = 300, message = "description must not exceed 300 characters")
    private String description;

    @NotEmpty(message = "imageUrl is required")
    @Size(max = 200, message = "imageUrl must not exceed 200 characters")
    @Column(name = "image_url")
    private String imageUrl;

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
    public String getOwnerLastName(){
        return owner!=null ? owner.getLastName() : "";
    }

    public String getOwnerFirstName(){
        return owner!=null ? owner.getFirstName() : "";
    }
}
