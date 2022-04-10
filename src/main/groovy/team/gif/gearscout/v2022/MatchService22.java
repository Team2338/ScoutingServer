package team.gif.gearscout.v2022;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.exception.MatchNotFoundException;
import team.gif.gearscout.v2022.model.Match22;
import team.gif.gearscout.v2022.model.NewMatch22;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class MatchService22 {
	
	private final MatchRepository22 matchRepository;
	
	@Autowired
	public MatchService22(MatchRepository22 matchRepository) {
		this.matchRepository = matchRepository;
	}
	
	public Match22 saveMatch(NewMatch22 match, Integer teamNumber, String secretCode) {
		String currentTime = Long.toString(System.currentTimeMillis());
		Match22 matchEntry = new Match22(match, teamNumber, secretCode, currentTime);
		
		return matchRepository.save(matchEntry);
	}
	
	public List<Match22> getAllMatchesForEvent(Integer teamNumber, String secretCode, String eventCode) {
		return matchRepository.findMatch22sByTeamNumberAndSecretCodeAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(teamNumber, secretCode, eventCode);
	}
	
	public Match22 setMatchHiddenStatus(Long matchId, String secretCode, boolean isHidden) {
		Match22 match = matchRepository
			.findMatchEntryByIdAndSecretCode(matchId, secretCode)
			.orElseThrow(() -> new MatchNotFoundException(matchId));
		
		match.setIsHidden(isHidden);
		match = matchRepository.save(match);
		
		return match;
	}
	
	public String getEventDataAsCsv(Integer teamNumber, String secretCode, String eventCode) {
		List<Match22> matches = matchRepository.findVisibleMatches(teamNumber, secretCode, eventCode);
		
		StringBuilder sb = new StringBuilder()
			.append(Match22.getCsvHeader());
		
		for (Match22 match : matches) {
			sb.append("\n").append(match.toCsv());
		}
		
		return sb.toString();
	}
}
