package team.gif.gearscout.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import team.gif.gearscout.model.MatchEntity;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends CrudRepository<MatchEntity, Long> {

	List<MatchEntity> findMatchEntriesByTeamNumberAndSecretCodeAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(Integer teamNumber, String secretCode, String eventCode);
	
	Optional<MatchEntity> findMatchEntryByIdAndSecretCode(Long id, String secretCode);
	
	@Query(value = "SELECT match FROM MatchEntity match WHERE match.teamNumber = :teamNumber AND match.secretCode = :secretCode AND match.eventCode = :eventCode AND match.isHidden = FALSE ORDER BY match.robotNumber, match.matchNumber, match.creator ASC")
	List<MatchEntity> findVisibleMatches(@Param("teamNumber") Integer teamNumber, @Param("secretCode") String secretCode, @Param("eventCode") String eventCode);
	
	@Query(value = "SELECT DISTINCT match.eventCode FROM MatchEntity match WHERE match.teamNumber = :teamNumber")
	List<String> findDistinctEventCodesByTeamNumber(@Param("teamNumber") Integer teamNumber);
	
	@Query(value = "SELECT DISTINCT match.teamNumber FROM MatchEntity match")
	List<Integer> findDistinctTeamNumbers();
	
}
