package team.gif.gearscout.matches;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class MatchController {
	
	private final MatchService matchService;
	private static final Logger logger = LogManager.getLogger(MatchController.class);
	
	
	@Autowired
	public MatchController(MatchService matchService) {
		this.matchService = matchService;
	}
	
	
	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addMatch(
			@PathVariable Integer teamNumber,
			@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
			@RequestBody NewMatch match
	) {
		logger.debug("Received addMatch request: {}", teamNumber);
		
		matchService.preprocessMatch(match);
		matchService.saveMatch(match, teamNumber, secretCode);
		
		return ResponseEntity.accepted().build();
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<MatchEntity>> getAllMatchesForEvent(
			@PathVariable Integer teamNumber,
			@PathVariable Integer gameYear,
			@PathVariable String eventCode,
			@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		logger.debug("Received getAllMatchesForEvent request: {}, {}", teamNumber, eventCode);
		
		List<MatchEntity> result = matchService.getAllMatchesForEvent(teamNumber, gameYear, secretCode, eventCode);
		
		return ResponseEntity.ok(result);
	}
	
	
	@PutMapping(value = "/team/{teamNumber}/match/{matchId}/hide")
	public ResponseEntity<MatchEntity> hideMatch(
			@PathVariable Integer teamNumber,
			@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
			@PathVariable Long matchId
	) {
		logger.debug("Received hideMatch request: {}, {}", teamNumber, matchId);
		MatchEntity result = matchService.setMatchHiddenStatus(matchId, secretCode, true);
		return ResponseEntity.ok(result);
	}
	
	
	@PutMapping(value = "/team/{teamNumber}/match/{matchId}/unhide")
	public ResponseEntity<MatchEntity> unhideMatch(
			@PathVariable Integer teamNumber,
			@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
			@PathVariable Long matchId
	) {
		logger.debug("Received unhideMatch request: {}, {}", teamNumber, matchId);
		MatchEntity result = matchService.setMatchHiddenStatus(matchId, secretCode, false);
		return ResponseEntity.ok(result);
	}
	
	
	@GetMapping(value = "/distinct")
	public ResponseEntity<List<Integer>> getDistinctTeamNumbers() {
		logger.debug("Received getDistinctTeamNumbers request");
		List<Integer> teamNumbers = matchService.getDistinctTeamNumbers();
		return ResponseEntity.ok(teamNumbers);
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/download", produces = "text/csv")
	public ResponseEntity<String> getCsvForEvent(
			@PathVariable Integer teamNumber,
			@PathVariable Integer gameYear,
			@PathVariable String eventCode,
			@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		logger.debug("Received getCsvForEvent request: {}, {}", teamNumber, eventCode);
		
		String content = matchService.getEventDataAsCsv(teamNumber, gameYear, secretCode, eventCode);
		String filename = "%d_%s.csv".formatted(teamNumber, eventCode);
		
		return ResponseEntity.ok()
				.header("Content-Disposition", "attachment; filename=" + filename)
				.body(content);
	}
	
}
