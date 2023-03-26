package team.gif.gearscout.repository;

import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.model.ImageContentEntity;

import java.util.Optional;

public interface ImageContentRepository extends CrudRepository<ImageContentEntity, Long> {
	
	// LIMIT keyword doesn't exist in HQL
//	@Query(value = """
//	SELECT image
//	FROM ImageContentEntity image
//	WHERE image.id = :imageId
//		AND image.secretCode = :secretCode
//	LIMIT 1
//	""")
//	Optional<ImageContentEntity> findImageContentForRobot(
//		Long imageId,
//		String secretCode
//	);
	
	Optional<ImageContentEntity> findFirstByIdAndSecretCodeOrderByIdAsc(Long id, String secretCode);
	
}
