package team.gif.gearscout.images;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.images.ImageContentEntity;

import java.util.Optional;

public interface ImageContentRepository extends CrudRepository<ImageContentEntity, Long> {
	
	// LIMIT keyword doesn't exist in HQL
	@Query(value = """
	SELECT image
	FROM ImageContentEntity image
	WHERE image.id = :imageId
		AND image.secretCode = :secretCode
	ORDER BY image.id ASC
	""")
	Optional<ImageContentEntity> findImageContentForRobot(
		Long imageId,
		String secretCode
	);
	
}
