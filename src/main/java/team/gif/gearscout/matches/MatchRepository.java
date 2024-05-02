package team.gif.gearscout.matches;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends CrudRepository<MatchEntity, Long> {

	List<MatchEntity> findMatchEntriesByTeamNumberAndSecretCodeAndEventCodeAndGameYearOrderByMatchNumberAscRobotNumberAscCreatorAsc(Integer teamNumber, String secretCode, String eventCode, Integer gameYear);
	
	Optional<MatchEntity> findMatchEntryByIdAndSecretCode(Long id, String secretCode);

	Optional<MatchEntity> findMatchEntryByIdAndTeamNumber(Long id, Integer teamNumber);
	
	@Query(value = """
	SELECT match
	FROM MatchEntity match
	WHERE match.teamNumber = :teamNumber
		AND match.gameYear = :gameYear
		AND match.secretCode = :secretCode
		AND match.eventCode = :eventCode
		AND match.isHidden = FALSE
	ORDER BY match.robotNumber, match.matchNumber, match.creator ASC
	""")
	List<MatchEntity> findVisibleMatches(
		@Param("teamNumber") Integer teamNumber,
		@Param("gameYear") Integer gameYear,
		@Param("secretCode") String secretCode,
		@Param("eventCode") String eventCode
	);

	/*
	SELECT game_year, event_code, secret_code, count(event_code) AS match_count
	FROM matches
	WHERE matches.team_number = :teamNumber
	GROUP BY game_year, event_code, secret_code
	ORDER BY game_year DESC
	 */

	@Query(value = """
	SELECT match.gameYear, match.eventCode, match.secretCode, COUNT(match.id) AS matchCount
	FROM MatchEntity match
	WHERE match.teamNumber = :teamNumber
	GROUP BY match.gameYear, match.eventCode, match.secretCode
	ORDER BY match.gameYear DESC
	""")
	List<EventInfo> getEventListForTeam(Integer teamNumber);

	// TODO: Doesn't account for events with same code but different year
	@Query(value = """
	SELECT DISTINCT match.eventCode
	FROM MatchEntity match
	WHERE match.teamNumber = :teamNumber
	""")
	List<String> findDistinctEventCodesByTeamNumber(@Param("teamNumber") Integer teamNumber);
	
	@Query(value = "SELECT DISTINCT match.teamNumber FROM MatchEntity match")
	List<Integer> findDistinctTeamNumbers();
	
}
