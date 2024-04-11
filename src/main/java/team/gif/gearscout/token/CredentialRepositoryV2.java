package team.gif.gearscout.token;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CredentialRepositoryV2 extends CrudRepository<CredentialEntityV2, Long> {

	/**
	 * Optionally fetches a credential if the provided user ID match a row in the database.
	 *
	 * @param userId The ID of the user
	 * @return An Optional containing the credential if there was a match; otherwise, an empty Optional
	 */
	@Query(value = """
	SELECT credentials
	FROM CredentialEntityV2 credentials
	WHERE credentials.userId = :userId
	""")
	Optional<CredentialEntityV2> findCredentialsByUserId(Long userId);

}
