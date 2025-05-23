package team.gif.gearscout.comments;

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
import team.gif.gearscout.comments.model.CommentEntity;
import team.gif.gearscout.comments.model.CreateCommentBulkRequest;
import team.gif.gearscout.events.EventService;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;

import java.util.List;


@RestController
@RequestMapping(value = "/api/v2/notes", produces = MediaType.APPLICATION_JSON_VALUE)
public class CommentController {

	private static final Logger logger = LogManager.getLogger(CommentController.class);
	private final CommentService commentService;
	private final EventService eventService;

	public CommentController(
		CommentService commentService,
		EventService eventService
	) {
		this.commentService = commentService;
		this.eventService = eventService;
	}

	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Iterable<CommentEntity>> addComment(
		@PathVariable @TeamNumberConstraint Integer teamNumber,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
		@RequestBody @Valid CreateCommentBulkRequest form
	) {
		logger.debug("Received addComment request");

		Long eventId = eventService.getOrCreateEvent(
			teamNumber,
			form.getGameYear(),
			form.getEventCode(),
			secretCode
		).getId();
		Iterable<CommentEntity> comments = commentService.saveComments(eventId, teamNumber, form);

		return ResponseEntity.ok(comments);
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<CommentEntity>> getAllCommentsForEvent(
		@PathVariable @TeamNumberConstraint Integer teamNumber,
		@PathVariable @GameYearConstraint Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getCommentsForEvent");

		Long eventId = eventService.getOrCreateEvent(
			teamNumber,
			gameYear,
			eventCode,
			secretCode
		).getId();
		List<CommentEntity> comments = commentService.getCommentsForEvent(eventId);

		return ResponseEntity.ok(comments);
	}

}
