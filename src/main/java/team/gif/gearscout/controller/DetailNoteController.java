package team.gif.gearscout.controller;

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
import team.gif.gearscout.model.CreateDetailNoteRequest;
import team.gif.gearscout.model.DetailNoteEntity;
import team.gif.gearscout.service.DetailNoteService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/detailnotes", produces = MediaType.APPLICATION_JSON_VALUE)
public class DetailNoteController {

	private static final Logger logger = LogManager.getLogger(DetailNoteController.class);
	private final DetailNoteService detailNoteService;

	public DetailNoteController(
		DetailNoteService detailNoteService
	) {
		this.detailNoteService = detailNoteService;
	}


	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addNote(
		@PathVariable Integer teamNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
		@RequestBody @Valid CreateDetailNoteRequest form
	) {
		logger.debug("Received addDetailNote request");

		detailNoteService.saveNotes(teamNumber, secretCode, form);

		return ResponseEntity.ok().build();
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<DetailNoteEntity>> getAllNotesForEvent(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@RequestHeader(value = "secretCode") String secretCode
	) {
		logger.debug("Received getDetailNotesForEvent request");

		List<DetailNoteEntity> notes = detailNoteService
			.getNotesForEvent(teamNumber, gameYear, eventCode, secretCode);

		return ResponseEntity.ok(notes);
	}

}
