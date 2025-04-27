package team.gif.gearscout.matches;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.matches.model.MatchEntity;
import team.gif.gearscout.shared.EventInfo;

import java.util.List;

public interface MatchRepository extends CrudRepository<MatchEntity, Long> {

	@Query(value = """
	SELECT match
	FROM MatchEntity match
	WHERE match.eventId = :eventId
	ORDER BY match.matchNumber, match.robotNumber, match.creator ASC
	""")
	List<MatchEntity> getMatchesForEvent(Long eventId);

	@Query(value = """
	SELECT match
	FROM MatchEntity match
	WHERE match.eventId = :eventId
		AND match.isHidden = FALSE
	ORDER BY match.robotNumber, match.matchNumber, match.creator ASC
	""")
	List<MatchEntity> findVisibleMatches(Long eventId);

	@Query(value = """
	SELECT new team.gif.gearscout.shared.EventInfo(
		match.eventId,
		COUNT(match.id)
	)
	FROM MatchEntity match
	WHERE match.eventId IN :eventIds
	GROUP BY match.eventId
	""")
	List<EventInfo> getMatchCountPerEvent(List<Long> eventIds);

}
