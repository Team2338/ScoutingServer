package team.gif.gearscout.images.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.images.model.ImageInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ImageInfoRepository extends CrudRepository<ImageInfoEntity, Long> {

	@Query(value = """
	SELECT image
	FROM ImageInfoEntity image
	WHERE image.eventId = :eventId
	ORDER BY image.robotNumber ASC
	""")
	List<ImageInfoEntity> findImagesForEvent(Long eventId);
	
	// LIMIT keyword doesn't exist in HQL
	@Query(value = """
	SELECT image
	FROM ImageInfoEntity image
	WHERE image.eventId = :eventId
		AND image.robotNumber = :robotNumber
	ORDER BY image.timeCreated ASC
	""")
	Optional<ImageInfoEntity> findImageForRobot(
		Long eventId,
		Integer robotNumber
	);
	
}
