package owt.boa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import owt.boa.models.Boat;
import owt.boa.models.RefreshToken;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<RefreshToken, Long> {


    RefreshToken findByTokenAndExpiryDateAfter(String givenToken, OffsetDateTime now);

    void deleteByToken(String refreshToken);
}
