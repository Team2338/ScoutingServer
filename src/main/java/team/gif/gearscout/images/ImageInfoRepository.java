package team.gif.gearscout.images;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ImageInfoRepository extends CrudRepository<ImageInfoEntity, Long> {

	@Query(value = """
	SELECT image
	FROM ImageInfoEntity image
	WHERE image.teamNumber = :teamNumber
		AND image.gameYear = :gameYear
		AND image.eventCode = :eventCode
		AND image.secretCode = :secretCode
	ORDER BY image.robotNumber ASC
	""")
	List<ImageInfoEntity> findImagesForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	);
	
	// LIMIT keyword doesn't exist in HQL
	@Query(value = """
	SELECT image
	FROM ImageInfoEntity image
	WHERE image.teamNumber = :teamNumber
		AND image.robotNumber = :robotNumber
		AND image.gameYear = :gameYear
		AND image.eventCode = :eventCode
		AND image.secretCode = :secretCode
	ORDER BY image.timeCreated ASC
	""")
	Optional<ImageInfoEntity> findImageForRobot(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String eventCode,
		String secretCode
	);
	
}
