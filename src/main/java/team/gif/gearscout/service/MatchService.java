package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.exception.MatchNotFoundException;
import team.gif.gearscout.model.MatchEntry;
import team.gif.gearscout.model.NewMatch;
import team.gif.gearscout.repository.MatchRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class MatchService {
	
	private final MatchRepository matchRepository;
	
	@Autowired
	public MatchService(MatchRepository matchRepository) {
		this.matchRepository = matchRepository;
	}
	
	public MatchEntry saveMatch(NewMatch match, Integer teamNumber) {
		// Convert Match to MatchEntry
		String currentTime = Long.toString(System.currentTimeMillis());
		MatchEntry matchEntry = new MatchEntry(match, teamNumber, currentTime);
		
		return matchRepository.save(matchEntry);
	}
	
	public List<MatchEntry> getAllMatchesForEvent(Integer teamNumber, String eventCode) {
		return matchRepository.findMatchEntriesByTeamNumberAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(teamNumber, eventCode);
	}
	
	public MatchEntry setMatchHiddenStatus(Long matchId, boolean isHidden) {
		MatchEntry match = matchRepository
				.findById(matchId)
				.orElseThrow(() -> new MatchNotFoundException(matchId));
		
		match.setIsHidden(isHidden);
		match = matchRepository.save(match);
		
		return match;
	}
	
}
