package team.gif.gearscout.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.gif.gearscout.model.MatchEntry;
import team.gif.gearscout.model.NewMatch;
import team.gif.gearscout.service.MatchService;

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
			@RequestBody NewMatch match
	) {
		logger.debug("Received addMatch request: {}", teamNumber);
		
		matchService.saveMatch(match, teamNumber);
		
		return ResponseEntity.accepted().build();
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/event/{eventCode}")
	public ResponseEntity<List<MatchEntry>> getAllMatchesForEvent(
			@PathVariable Integer teamNumber,
			@PathVariable String eventCode
	) {
		logger.debug("Received getAllMatchesForEvent request: {}, {}", teamNumber, eventCode);
		
		List<MatchEntry> result = matchService.getAllMatchesForEvent(teamNumber, eventCode);
		
		return ResponseEntity.ok(result);
	}
	
}
