package team.gif.gearscout.images;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface ImageContentRepository extends CrudRepository<ImageContentEntity, Long> {

	@Query(value = """
	DELETE FROM ImageContentEntity image
	WHERE image.id = :imageId
	""")
	void deleteImageContentById(UUID imageId);
	
	// LIMIT keyword doesn't exist in HQL
	@Query(value = """
	SELECT image
	FROM ImageContentEntity image
	WHERE image.id = :imageId
	""")
	Optional<ImageContentEntity> findImageContentForRobot(
		UUID imageId
	);
	
}
