package team.gif.gearscout.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import team.gif.gearscout.model.MatchEntry;

import java.util.List;

public interface MatchRepository extends CrudRepository<MatchEntry, Long> {

	List<MatchEntry> findMatchEntriesByTeamNumberAndEventCode(Integer teamNumber, String eventCode);
	
	@Query(value = "SELECT DISTINCT match.eventCode FROM MatchEntry match WHERE match.teamNumber = :teamNumber")
	List<String> findDistinctEventCodesByTeamNumber(@Param("teamNumber") Integer teamNumber);
	
	@Query(value = "SELECT DISTINCT match.teamNumber FROM MatchEntry match")
	List<Integer> findDistinctTeamNumbers();
	
	void deleteAllByTeamNumberAndEventCodeAndCreator(Integer teamNumber, String eventCode, String creator);
	
}
