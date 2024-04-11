package team.gif.gearscout.token;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends CrudRepository<TokenEntity, UUID> {

	@Query(value = """
	DELETE FROM TokenEntity token
	WHERE token.tokenId = :tokenId
	""")
	void deleteByTokenId(UUID tokenId);

	@Query(value = """
	SELECT token
	FROM TokenEntity token
	WHERE token.tokenId = :tokenId
	""")
	Optional<TokenEntity> getTokenEntity(UUID tokenId);

}
