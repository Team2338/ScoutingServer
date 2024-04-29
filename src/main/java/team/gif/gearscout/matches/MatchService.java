package team.gif.gearscout.matches;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.shared.exception.MatchNotFoundException;

import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class MatchService {
	
	private final MatchRepository matchRepository;
	private final HashMap<Integer, MatchPreprocessor> preprocessors;
	private final MatchPreprocessor dummyPreprocessor;
	
	@Autowired
	public MatchService(
		MatchRepository matchRepository,
		MatchProcessor2023 matchProcessor2023
	) {
		this.matchRepository = matchRepository;
		this.preprocessors = new HashMap<>();
		this.dummyPreprocessor = (NewMatch match) -> {};

		preprocessors.put(2023, matchProcessor2023);
	}

	public void preprocessMatch(NewMatch match) {
		int gameYear = match.getGameYear();
		MatchPreprocessor preprocessor = preprocessors.getOrDefault(gameYear, dummyPreprocessor);
		preprocessor.process(match);
	}

	public MatchEntity saveMatch(NewMatch match, Integer teamNumber, String secretCode) {
		// Convert Match to MatchEntry
		String currentTime = Long.toString(System.currentTimeMillis());
		MatchEntity matchEntity = new MatchEntity(match, teamNumber, secretCode, currentTime);
		
		return matchRepository.save(matchEntity);
	}
	
	public List<MatchEntity> getAllMatchesForEvent(Integer teamNumber, Integer gameYear, String secretCode, String eventCode) {
		return matchRepository.findMatchEntriesByTeamNumberAndSecretCodeAndEventCodeAndGameYearOrderByMatchNumberAscRobotNumberAscCreatorAsc(teamNumber, secretCode, eventCode, gameYear);
	}
	
	public MatchEntity setMatchHiddenStatus(Long matchId, String secretCode, boolean isHidden) {
		MatchEntity match = matchRepository
				.findMatchEntryByIdAndSecretCode(matchId, secretCode)
				.orElseThrow(() -> new MatchNotFoundException(matchId));
		
		match.setIsHidden(isHidden);
		match = matchRepository.save(match);
		
		return match;
	}

	public MatchEntity setMatchHiddenStatus(Integer teamNumber, Long matchId, boolean isHidden) {
		MatchEntity match = matchRepository
			.findMatchEntryByIdAndTeamNumber(matchId, teamNumber)
			.orElseThrow(() -> new MatchNotFoundException(matchId));

		match.setIsHidden(isHidden);
		match = matchRepository.save(match);

		return match;
	}

	public MatchEntity setMatchHiddenStatus(Long matchId, boolean isHidden) {
		MatchEntity match = matchRepository
			.findById(matchId)
			.orElseThrow(() -> new MatchNotFoundException(matchId));

		match.setIsHidden(isHidden);
		match = matchRepository.save(match);

		return match;
	}

	public List<Integer> getDistinctTeamNumbers() {
		return matchRepository.findDistinctTeamNumbers();
	}
	
	public String getEventDataAsCsv(Integer teamNumber, Integer gameYear, String secretCode, String eventCode) {
		List<MatchEntity> matches = matchRepository.findVisibleMatches(teamNumber, gameYear, secretCode, eventCode);
		
		HashSet<String> scoreNames = getUniqueScoreNames(matches); // Collect names of all objectives
		String[] sortedScoreNames = getSortedScoreNames(scoreNames); // Sort score names
		HashMap<String, Integer> scorePositions = getScorePositions(sortedScoreNames); // Index score names
		
		// Build header
		StringBuilder sb = new StringBuilder();
		sb.append(getCsvHeader(sortedScoreNames));
		
		// Append each line of match data
		for (MatchEntity match : matches) {
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
	private HashSet<String> getUniqueScoreNames(List<MatchEntity> matches) {
		HashSet<String> scoreNames = new HashSet<>();
		for (MatchEntity match : matches) {
			for (ObjectiveEntity objective : match.getObjectives()) {
				String name = this.getObjectiveName(objective);
				scoreNames.add(name);
			}
		}
		
		return scoreNames;
	}
	
	private String getObjectiveName(ObjectiveEntity obj) {
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
	
	private String getLineFromMatch(MatchEntity match, HashMap<String, Integer> scorePositions) {
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
	
	private String[] getSortedScores(MatchEntity match, HashMap<String, Integer> scorePositions) {
		String[] scores = new String[scorePositions.size()]; // One score for each possible objective (null if not listed)
		Arrays.fill(scores, "");
		
		for (ObjectiveEntity objective : match.getObjectives()) {
			String name = this.getObjectiveName(objective);
			int position = scorePositions.get(name);
			scores[position] = objective.getCount().toString();
		}
		
		return scores;
	}
	
}
