package owt.boa.models;

import jakarta.persistence.Basic;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Auditable;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Objects;

/**
 * Abstract base class for auditable JPA entities.
 *
 * This class is annotated with @MappedSuperclass and uses @CreatedBy, @CreatedDate,
 * @LastModifiedBy, and @LastModifiedDate annotations provided by Spring Data JPA.
 *
 * The actual auditing values (who created/updated the entity) are provided by
 * the AuditorAware implementation defined in the AuditConfig class:
 *
 * @see owt.boa.config.AuditConfig
 *
 * The AuditConfig defines a bean of type AuditorAware<String> that extracts the
 * username from the Spring Security context, which allows automatic population
 * of audit fields during entity persistence/update.
 */
@MappedSuperclass
@EntityListeners({AuditingEntityListener.class})
public abstract class AuditableEntity<PK extends Serializable> implements Auditable<String, PK, LocalDateTime> {

    /**
     * Username of the user who created the entity.
     * Automatically populated using AuditorAware.
     */
    @CreatedBy
    @Basic
    private String createdBy = "system";

    /**
     * Timestamp when the entity was created.
     * Automatically populated by JPA auditing.
     */
    @CreatedDate
    @Basic
    private LocalDateTime createdDate = LocalDateTime.now();

    /**
     * Username of the last user who modified the entity.
     * Automatically updated using AuditorAware.
     */
    @LastModifiedBy
    @Basic
    private String lastModifiedBy;

    /**
     * Timestamp of the last modification.
     * Automatically updated by JPA auditing.
     */
    @LastModifiedDate
    @Basic
    private LocalDateTime lastModifiedDate = LocalDateTime.now();

    // Getters and setters with Optional to avoid null checks

    public Optional<LocalDateTime> getLastModifiedDate() {
        return Optional.ofNullable(lastModifiedDate);
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Optional<String> getLastModifiedBy() {
        return Optional.ofNullable(lastModifiedBy);
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Optional<LocalDateTime> getCreatedDate() {
        return Optional.ofNullable(createdDate);
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Optional<String> getCreatedBy() {
        return Optional.ofNullable(createdBy);
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Determines if the entity is new (not yet persisted).
     */
    @Override
    public boolean isNew() {
        return getId() == null;
    }

    @Override
    public String toString() {
        return String.format("Entity of type %s with id: %s", this.getClass().getName(), getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!getClass().isAssignableFrom(obj.getClass())) {
            return false;
        }
        final AuditableEntity<?> other = (AuditableEntity<?>) obj;
        return Objects.equals(this.getId(), other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }


}
