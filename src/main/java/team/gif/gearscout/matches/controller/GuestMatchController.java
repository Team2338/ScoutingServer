package team.gif.gearscout.matches.controller;

import jakarta.validation.Valid;
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
import team.gif.gearscout.events.EventEntity;
import team.gif.gearscout.events.EventService;
import team.gif.gearscout.matches.model.MatchEntity;
import team.gif.gearscout.matches.MatchService;
import team.gif.gearscout.matches.model.CreateMatchRequest;
import team.gif.gearscout.shared.exception.MatchNotFoundException;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class GuestMatchController {

	private final MatchService matchService;
	private final EventService eventService;
	private static final Logger logger = LogManager.getLogger(GuestMatchController.class);
	
	
	@Autowired
	public GuestMatchController(
		MatchService matchService,
		EventService eventService
	) {
		this.matchService = matchService;
		this.eventService = eventService;
	}
	
	
	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addMatch(
			@PathVariable @TeamNumberConstraint Integer teamNumber,
			@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
			@RequestBody @Valid CreateMatchRequest match
	) {
		logger.debug("Received addMatch request: {}", teamNumber);

		Long eventId = eventService
			.getOrCreateEvent(teamNumber, match.getGameYear(), match.getEventCode(), secretCode)
			.getId();
		matchService.preprocessMatch(match);
		matchService.saveMatch(eventId, teamNumber, match);
		
		return ResponseEntity.accepted().build();
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<MatchEntity>> getAllMatchesForEvent(
			@PathVariable @TeamNumberConstraint Integer teamNumber,
			@PathVariable @GameYearConstraint Integer gameYear,
			@PathVariable @EventCodeConstraint String eventCode,
			@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getAllMatchesForEvent request: {}, {}", teamNumber, eventCode);

		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		List<MatchEntity> result = matchService.getAllMatchesForEvent(eventId);
		
		return ResponseEntity.ok(result);
	}

	
	@PutMapping(value = "/team/{teamNumber}/match/{matchId}/hide")
	public ResponseEntity<MatchEntity> hideMatch(
			@PathVariable @TeamNumberConstraint Integer teamNumber,
			@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
			@PathVariable Long matchId
	) {
		logger.debug("Received hideMatch request: {}, {}", teamNumber, matchId);

		// Check if the user has the correct secret code
		MatchEntity originalMatch = matchService.getMatch(matchId);
		EventEntity event = eventService.getEvent(originalMatch.getEventId());
		if (!event.getSecretCode().equals(secretCode)) {
			throw new MatchNotFoundException(matchId);
		}

		MatchEntity result = matchService.setMatchHiddenStatus(matchId, true);
		return ResponseEntity.ok(result);
	}
	
	
	@PutMapping(value = "/team/{teamNumber}/match/{matchId}/unhide")
	public ResponseEntity<MatchEntity> unhideMatch(
			@PathVariable @TeamNumberConstraint Integer teamNumber,
			@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
			@PathVariable Long matchId
	) {
		logger.debug("Received unhideMatch request: {}, {}", teamNumber, matchId);

		// Check if the user has the correct secret code
		MatchEntity originalMatch = matchService.getMatch(matchId);
		EventEntity event = eventService.getEvent(originalMatch.getEventId());
		if (!event.getSecretCode().equals(secretCode)) {
			throw new MatchNotFoundException(matchId);
		}

		MatchEntity result = matchService.setMatchHiddenStatus(matchId, false);
		return ResponseEntity.ok(result);
	}

	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/download", produces = "text/csv")
	public ResponseEntity<String> getCsvForEvent(
			@PathVariable @TeamNumberConstraint Integer teamNumber,
			@PathVariable @GameYearConstraint Integer gameYear,
			@PathVariable @EventCodeConstraint String eventCode,
			@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getCsvForEvent request: {}, {}", teamNumber, eventCode);

		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		String content = matchService.getEventDataAsCsv(eventId);
		String filename = "%d_%s.csv".formatted(teamNumber, eventCode);
		
		return ResponseEntity.ok()
				.header("Content-Disposition", "attachment; filename=" + filename)
				.body(content);
	}
	
}
