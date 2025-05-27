package owt.boa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import owt.boa.models.Boat;

import java.util.List;

@Repository
public interface BoatRepository extends JpaRepository<Boat, Long> {

    List<Boat> findAllByOrderByCreatedDateDesc();

    @Query("SELECT b FROM Boat b WHERE b.owner.id = :userId ORDER BY b.createdDate DESC")
    List<Boat> findByUserId(@Param("userId") Long userId);

}
