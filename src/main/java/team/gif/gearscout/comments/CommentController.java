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

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping(value = "/api/v2/notes", produces = MediaType.APPLICATION_JSON_VALUE)
public class CommentController {

	private static final Logger logger = LogManager.getLogger(CommentController.class);
	private final CommentService commentService;

	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}

	@PostMapping(value = "/team/{teamNumber}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<CommentEntity> addComment(
		@PathVariable Integer teamNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
		@RequestBody @Valid CreateCommentRequest form
	) {
		logger.debug("Received addComment request");

		CommentEntity comment = commentService.saveComment(teamNumber, secretCode, form);

		return ResponseEntity.ok(comment);
	}

	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<CommentEntity>> getAllCommentsForEvent(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@RequestHeader(value = "secretCode") String secretCode
	) {
		logger.debug("Received getCommentsForEvent");

		List<CommentEntity> comments = commentService
			.getCommentsForEvent(teamNumber, gameYear, eventCode, secretCode);

		return ResponseEntity.ok(comments);
	}

}
