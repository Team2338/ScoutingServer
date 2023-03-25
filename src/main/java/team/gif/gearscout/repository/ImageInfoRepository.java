package team.gif.gearscout.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.model.ImageInfoEntity;

import java.util.Optional;

public interface ImageInfoRepository extends CrudRepository<ImageInfoEntity, Long> {

	// We don't want users requesting so much data when they likely won't look at most of it
//	@Query(value = """
//	SELECT image
//	FROM ImageEntity image
//	WHERE image.teamNumber = :teamNumber
//		AND image.gameYear = :gameYear
//		AND image.eventCode = :eventCode
//		AND image.secretCode = :secretCode
//	ORDER BY image.teamNumber ASC
//	""")
//	List<ImageEntity> findImagesForEvent(
//		Integer teamNumber,
//		Integer gameYear,
//		String eventCode,
//		String secretCode
//	);
	
	@Query(value = """
	SELECT image
	FROM ImageInfoEntity image
	WHERE image.teamNumber = :teamNumber
		AND image.robotNumber = :robotNumber
		AND image.gameYear = :gameYear
		AND image.secretCode = :secretCode
	LIMIT 1
	""")
	Optional<ImageInfoEntity> findImageForRobot(
		Integer teamNumber,
		Integer robotNumber,
		Integer gameYear,
		String secretCode
	);

}
