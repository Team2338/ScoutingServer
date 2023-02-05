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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.gif.gearscout.model.NewNote;
import team.gif.gearscout.model.NoteEntity;
import team.gif.gearscout.service.NoteService;

import java.util.List;


@RestController
@RequestMapping(value = "/api/v1/notes", produces = MediaType.APPLICATION_JSON_VALUE)
public class NoteController {
	
	private static final Logger logger = LogManager.getLogger(NoteController.class);
	private final NoteService noteService;
	
	@Autowired
	public NoteController(NoteService noteService) {
		this.noteService = noteService;
	}
	
	
	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> addNote(
		@PathVariable Integer teamNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
		@RequestBody NewNote note
	) {
		logger.debug("Received addNote request: {}", teamNumber);
		noteService.saveNote(note, teamNumber, secretCode);
		
		return ResponseEntity.accepted().build();
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/event/{eventCode}/robot/{robotNumber}")
	public ResponseEntity<List<NoteEntity>> getNotesForTeam(
		@PathVariable Integer teamNumber,
		@PathVariable String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		logger.debug("Received getNotesForTeam request: {}, {}, {}", teamNumber, eventCode, robotNumber);
		List<NoteEntity> result = noteService.getAllNotesForTeam(teamNumber, secretCode, eventCode, robotNumber);
		
		return ResponseEntity.ok(result);
	}
	
}
