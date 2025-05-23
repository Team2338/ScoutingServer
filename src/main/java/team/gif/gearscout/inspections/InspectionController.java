package team.gif.gearscout.inspections;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import team.gif.gearscout.events.EventService;
import team.gif.gearscout.inspections.model.CreateInspectionRequest;
import team.gif.gearscout.inspections.model.InspectionEntity;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;

import java.util.List;

// TODO: Start accepting tokens and not secret codes
// TODO: Get 'creator' from token and not request body
@RestController
@RequestMapping(value = "/api/v1/detailnotes", produces = MediaType.APPLICATION_JSON_VALUE)
public class InspectionController {

	private static final Logger logger = LogManager.getLogger(InspectionController.class);
	private final InspectionService inspectionService;
	private final EventService eventService;

	public InspectionController(
		InspectionService inspectionService,
		EventService eventService
	) {
		this.inspectionService = inspectionService;
		this.eventService = eventService;
	}


	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addInspection(
		@PathVariable @TeamNumberConstraint Integer teamNumber,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
		@RequestBody @Valid CreateInspectionRequest form
	) {
		logger.debug("Received addInspection request");

		Long eventId = eventService
			.getOrCreateEvent(teamNumber, form.getGameYear(), form.getEventCode(), secretCode)
			.getId();
		inspectionService.saveInspections(eventId, teamNumber, form);

		return ResponseEntity.ok().build();
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<InspectionEntity>> getAllInspectionsForEvent(
		@PathVariable @TeamNumberConstraint Integer teamNumber,
		@PathVariable @GameYearConstraint Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getInspectionsForEvent request");

		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		List<InspectionEntity> inspections = inspectionService
			.getInspectionsForEvent(eventId);

		return ResponseEntity.ok(inspections);
	}

}
