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
import java.util.List;

// TODO: Start accepting tokens and not secret codes
// TODO: Get 'creator' from token and not request body
@RestController
@RequestMapping(value = "/api/v1/detailnotes", produces = MediaType.APPLICATION_JSON_VALUE)
public class InspectionController {

	private static final Logger logger = LogManager.getLogger(InspectionController.class);
	private final InspectionService inspectionService;

	public InspectionController(
		InspectionService inspectionService
	) {
		this.inspectionService = inspectionService;
	}


	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addInspection(
		@PathVariable Integer teamNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
		@RequestBody @Valid CreateInspectionRequest form
	) {
		logger.debug("Received addInspection request");

		inspectionService.saveInspections(teamNumber, secretCode, form);

		return ResponseEntity.ok().build();
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<InspectionEntity>> getAllInspectionsForEvent(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@RequestHeader(value = "secretCode") String secretCode
	) {
		logger.debug("Received getInspectionsForEvent request");

		List<InspectionEntity> inspections = inspectionService
			.getInspectionsForEvent(teamNumber, gameYear, eventCode, secretCode);

		return ResponseEntity.ok(inspections);
	}

}
