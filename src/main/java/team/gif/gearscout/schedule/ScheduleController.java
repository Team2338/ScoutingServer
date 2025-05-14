package team.gif.gearscout.schedule;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;
import team.gif.gearscout.tba.MatchScheduleEntry;
import team.gif.gearscout.tba.TbaService;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v2/schedule", produces = MediaType.APPLICATION_JSON_VALUE)
public class ScheduleController {
	private static final Logger logger = LogManager.getLogger(ScheduleController.class);

	private final TbaService tbaService;

	@Autowired
	public ScheduleController(
		TbaService tbaService
	) {
		this.tbaService = tbaService;
	}

	@GetMapping(value = "/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<MatchScheduleEntry>> getScheduleForEvent(
		@PathVariable @GameYearConstraint Integer gameYear,
		@PathVariable String eventCode
	) {
		logger.debug("Received getScheduleForEvent request: {}, {}", gameYear, eventCode);

		List<MatchScheduleEntry> result = tbaService.getMatchSchedule(eventCode, gameYear);

		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<MatchScheduleEntry>> getScheduleForTeam(
		@PathVariable @TeamNumberConstraint Integer teamNumber,
		@PathVariable @GameYearConstraint Integer gameYear,
		@PathVariable String eventCode
	) {
		logger.debug("Received getScheduleForTeam request: {}, {}, {}", teamNumber, gameYear, eventCode);

		List<MatchScheduleEntry> result = tbaService.getMatchesForTeam(eventCode, gameYear, teamNumber);

		return ResponseEntity.ok(result);
	}
}
