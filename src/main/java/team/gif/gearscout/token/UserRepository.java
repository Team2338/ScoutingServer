package team.gif.gearscout.token;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<UserEntity, Long> {

	@Query(value = """
	SELECT user
	FROM UserEntity user
	WHERE user.email = :email
	""")
	Optional<UserEntity> findByEmail(String email);

}
