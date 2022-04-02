package team.gif.gearscout.v2022;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import team.gif.gearscout.v2022.model.Match22;

import java.util.List;
import java.util.Optional;

public interface MatchRepository22 extends CrudRepository<Match22, Long> {
	
	String findVisibleMatchesQuery = """
	SELECT match FROM Match22 match
	WHERE match.teamNumber = :teamNumber
	AND match.secretCode = :secretCode
	AND match.eventCode = :eventCode
	AND match.isHidden = FALSE
	ORDER BY match.robotNumber, match.matchNumber, match.creator ASC
	""";
	
	List<Match22> findMatch22sByTeamNumberAndSecretCodeAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(
		Integer teamNumber,
		String secretCode,
		String eventCode
	);
	
	Optional<Match22> findMatchEntryByIdAndSecretCode(
		Long id,
		String secretCode
	);
	
	@Query(findVisibleMatchesQuery)
	List<Match22> findVisibleMatches(
		@Param("teamNumber") Integer teamNumber,
		@Param("secretCode") String secretCode,
		@Param("eventCode") String eventCode
	);
	
}
