package team.gif.gearscout.events;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends CrudRepository<EventEntity, Long> {

	@Query(value = """
	SELECT event
	FROM EventEntity event
	WHERE event.teamNumber = :teamNumber
		AND event.gameYear = :gameYear
		AND event.eventCode = :eventCode
		AND event.secretCode = :secretCode
	""")
	Optional<EventEntity> findByEventDescriptor(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	);

	@Query(value = """
	SELECT event
	FROM EventEntity event
	WHERE event.teamNumber = :teamNumber
	ORDER BY event.gameYear DESC
	""")
	List<EventEntity> getEventEntitiesByTeamNumber(Integer teamNumber);

	@Query(value = """
	SELECT event
	FROM EventEntity event
	WHERE event.gameYear = :gameYear
		AND event.eventCode = :eventCode
		AND event.secretCode = :secretCode
		AND event.shared = TRUE
	""")
	List<EventEntity> findSharedEvents(
		Integer gameYear,
		String eventCode,
		String secretCode
	);
}
