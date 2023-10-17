package team.gif.gearscout.inspections;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface InspectionRepository extends CrudRepository<InspectionEntity, Long> {

	@Query(value = """
	SELECT inspection
	FROM InspectionEntity inspection
	WHERE inspection.teamNumber = :teamNumber
		AND inspection.gameYear = :gameYear
		AND inspection.eventCode = :eventCode
		AND inspection.secretCode = :secretCode
	ORDER BY inspection.robotNumber, inspection.question ASC
	""")
	List<InspectionEntity> findInspectionsForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	);

	@Modifying
	@Query(value = """
	DELETE
	FROM InspectionEntity inspection
	WHERE inspection.teamNumber = :teamNumber
		AND inspection.gameYear = :gameYear
		AND inspection.robotNumber = :robotNumber
		AND inspection.eventCode = :eventCode
		AND inspection.secretCode = :secretCode
		AND inspection.question IN :questions
	""")
	void removeInspectionsByQuestion(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String eventCode,
		String secretCode,
		List<String> questions
	);

}
