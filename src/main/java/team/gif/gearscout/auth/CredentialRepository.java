package team.gif.gearscout.auth;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CredentialRepository extends CrudRepository<CredentialEntity, Long> {
	
	@Query(value = """
	SELECT credentials
	FROM CredentialEntity credentials
	WHERE credentials.teamNumber = :teamNumber
		AND credentials.username = :username
	""")
	Optional<CredentialEntity> getCredentials(Integer teamNumber, String username);
	
}
