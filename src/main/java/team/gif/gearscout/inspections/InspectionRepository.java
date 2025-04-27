package team.gif.gearscout.inspections;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.shared.EventInfo;

import java.util.List;

public interface InspectionRepository extends CrudRepository<InspectionEntity, Long> {

	@Query(value = """
	SELECT inspection
	FROM InspectionEntity inspection
	WHERE inspection.eventId = :eventId
	ORDER BY inspection.robotNumber, inspection.question ASC
	""")
	List<InspectionEntity> findInspectionsForEvent(Long eventId);

	@Modifying
	@Query(value = """
	DELETE
	FROM InspectionEntity inspection
	WHERE inspection.eventId = :eventId
		AND inspection.robotNumber = :robotNumber
		AND inspection.question IN :questions
	""")
	void removeInspectionsByQuestion(
		Long eventId,
		Integer robotNumber,
		List<String> questions
	);

	@Query(value = """
	SELECT new team.gif.gearscout.shared.EventInfo(
		inspection.eventId,
		null,
		null,
		null,
		null,
		COUNT(DISTINCT inspection.robotNumber)
	)
	FROM InspectionEntity inspection
	WHERE inspection.eventId IN :eventIds
	GROUP BY inspection.eventId
	""")
	List<EventInfo> getInspectionCountPerEvent(List<Long> eventIds);

}
