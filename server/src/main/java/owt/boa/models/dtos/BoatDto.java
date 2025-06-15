package owt.boa.models.dtos;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;


public class BoatDto  {

    private Long id;

    @NotEmpty(message = "name is required")
    @Size(max = 50, message = "name must not exceed 50 characters")
    private String name;

    @NotEmpty(message = "description is required")
    @Size(max = 300, message = "description must not exceed 300 characters")
    private String description;


    @NotEmpty(message = "imageUrl is required")
    @Size(max = 200, message = "imageUrl must not exceed 200 characters")
    private String imageUrl;

    private UserDto owner;

    private Long userId;

    private String createdBy = "system";

    private LocalDateTime createdDate = LocalDateTime.now();

    private String lastModifiedBy;

    private LocalDateTime lastModifiedDate = LocalDateTime.now();


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

    public UserDto getOwner() {
        return owner;
    }

    public void setOwner(UserDto owner) {
        this.owner = owner;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOwnerLastName(){
        return owner!=null ? owner.getLastName() : "";
    }

    public String getOwnerFirstName(){
        return owner!=null ? owner.getFirstName() : "";
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
