package team.gif.gearscout.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class CommentService {

	private final CommentRepository commentRepository;

	@Autowired
	public CommentService(CommentRepository commentRepository) {
		this.commentRepository = commentRepository;
	}


	public Iterable<CommentEntity> saveComments(
		Long eventId,
		Integer teamNumber,
		CreateCommentBulkRequest form
	) {
		OffsetDateTime currentTime = Instant.now()
			.atOffset(ZoneOffset.UTC)
			.truncatedTo(ChronoUnit.SECONDS);

		List<CommentEntity> comments = form.getComments()
			.stream()
			.map((singleCommentContent) -> {
				CommentEntity comment = new CommentEntity();
				comment.setEventId(eventId);
				comment.setTeamNumber(teamNumber);
				comment.setRobotNumber(form.getRobotNumber());
				comment.setGameYear(form.getGameYear());
				comment.setMatchNumber(form.getMatchNumber());
				comment.setTopic(singleCommentContent.getTopic());
				comment.setContent(singleCommentContent.getContent());
				comment.setCreator(form.getCreator());
				comment.setTimeCreated(currentTime);

				return comment;
			})
			.toList();

		return commentRepository.saveAll(comments);
	}


	public List<CommentEntity> getCommentsForEvent(Long eventId) {
		return commentRepository.findCommentsByEventId(eventId);
	}

}
