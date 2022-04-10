package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.exception.MatchNotFoundException;
import team.gif.gearscout.model.MatchEntry;
import team.gif.gearscout.model.NewMatch;
import team.gif.gearscout.model.ObjectiveEntry;
import team.gif.gearscout.repository.MatchRepository;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class MatchService {
	
	private final MatchRepository matchRepository;
	
	@Autowired
	public MatchService(MatchRepository matchRepository) {
		this.matchRepository = matchRepository;
	}
	
	public MatchEntry saveMatch(NewMatch match, Integer teamNumber, String secretCode) {
		// Convert Match to MatchEntry
		String currentTime = Long.toString(System.currentTimeMillis());
		MatchEntry matchEntry = new MatchEntry(match, teamNumber, secretCode, currentTime);
		
		return matchRepository.save(matchEntry);
	}
	
	public List<MatchEntry> getAllMatchesForEvent(Integer teamNumber, String secretCode, String eventCode) {
		return matchRepository.findMatchEntriesByTeamNumberAndSecretCodeAndEventCodeOrderByMatchNumberAscRobotNumberAscCreatorAsc(teamNumber, secretCode, eventCode);
	}
	
	public MatchEntry setMatchHiddenStatus(Long matchId, String secretCode, boolean isHidden) {
		MatchEntry match = matchRepository
				.findMatchEntryByIdAndSecretCode(matchId, secretCode)
				.orElseThrow(() -> new MatchNotFoundException(matchId));
		
		match.setIsHidden(isHidden);
		match = matchRepository.save(match);
		
		return match;
	}
	
	public String getEventDataAsCsv(Integer teamNumber, String secretCode, String eventCode) {
		List<MatchEntry> matches = matchRepository.findVisibleMatches(teamNumber, secretCode, eventCode);
		
		HashSet<String> scoreNames = getUniqueScoreNames(matches); // Collect names of all objectives
		String[] sortedScoreNames = getSortedScoreNames(scoreNames); // Sort score names
		HashMap<String, Integer> scorePositions = getScorePositions(sortedScoreNames); // Index score names
		
		// Build header
		StringBuilder sb = new StringBuilder();
		sb.append(getCsvHeader(sortedScoreNames));
		
		// Append each line of match data
		for (MatchEntry match : matches) {
			String line = getLineFromMatch(match, scorePositions);
			sb.append("\n").append(line);
		}
		
		return sb.toString();
	}
	
	
	/**
	 * Gets the set of unique identifiers for each objective present in the match
	 * history. An objective identifier is defined as "{gamemode}_{objective}".
	 *
	 * @param matches The match history
	 * @return The set of unique identifiers for each objective present in the match history.
	 */
	private HashSet<String> getUniqueScoreNames(List<MatchEntry> matches) {
		HashSet<String> scoreNames = new HashSet<>();
		for (MatchEntry match : matches) {
			for (ObjectiveEntry objective : match.getObjectives()) {
				String name = this.getObjectiveName(objective);
				scoreNames.add(name);
			}
		}
		
		return scoreNames;
	}
	
	private String getObjectiveName(ObjectiveEntry obj) {
		return obj.getGamemode() + "_" + obj.getObjective();
	}
	
	private String[] getSortedScoreNames(Collection<String> scoreNames) {
		return scoreNames
				.stream()
				.sorted(String::compareTo)
				.toArray(String[]::new);
	}
	
	private HashMap<String, Integer> getScorePositions(String[] scoreNames) {
		HashMap<String, Integer> scorePositions = new HashMap<>();
		for (int i = 0; i < scoreNames.length; i++) {
			scorePositions.put(scoreNames[i], i);
		}
		
		return scorePositions;
	}
	
	private String getCsvHeader(String[] sortedScoreNames) {
		StringBuilder header = new StringBuilder("robot_num,match_num,scouter");
		for (String scoreName : sortedScoreNames) {
			header.append(",").append(scoreName);
		}
		
		return header.toString();
	}
	
	private String getLineFromMatch(MatchEntry match, HashMap<String, Integer> scorePositions) {
		StringBuilder line = new StringBuilder()
				.append(match.getRobotNumber())
				.append(",")
				.append(match.getMatchNumber())
				.append(",")
				.append(match.getCreator());
		
		String[] scores = getSortedScores(match, scorePositions);
		for (String score : scores) {
			line.append(",").append(score);
		}
		
		return line.toString();
	}
	
	private String[] getSortedScores(MatchEntry match, HashMap<String, Integer> scorePositions) {
		String[] scores = new String[scorePositions.size()]; // One score for each possible objective (null if not listed)
		Arrays.fill(scores, "");
		
		for (ObjectiveEntry objective : match.getObjectives()) {
			String name = this.getObjectiveName(objective);
			int position = scorePositions.get(name);
			scores[position] = objective.getCount().toString();
		}
		
		return scores;
	}
	
}
