package team.gif.gearscout.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import team.gif.gearscout.model.MatchEntry;

import java.util.List;

public interface MatchRepository extends CrudRepository<MatchEntry, Long> {

	List<MatchEntry> findMatchEntriesByTeamNumberAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(Integer teamNumber, String eventCode);
	
	@Query(value = "SELECT match FROM MatchEntry match WHERE match.teamNumber = :teamNumber AND match.eventCode = :eventCode AND match.isHidden = FALSE ORDER BY match.robotNumber, match.matchNumber, match.creator ASC")
	List<MatchEntry> findVisibleMatches(@Param("teamNumber") Integer teamNumber, @Param("eventCode") String eventCode);
	
	@Query(value = "SELECT DISTINCT match.eventCode FROM MatchEntry match WHERE match.teamNumber = :teamNumber")
	List<String> findDistinctEventCodesByTeamNumber(@Param("teamNumber") Integer teamNumber);
	
	@Query(value = "SELECT DISTINCT match.teamNumber FROM MatchEntry match")
	List<Integer> findDistinctTeamNumbers();
	
}
