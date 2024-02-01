package team.gif.gearscout.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class CommentService {

	private final CommentRepository commentRepository;

	@Autowired
	public CommentService(CommentRepository commentRepository) {
		this.commentRepository = commentRepository;
	}


	public Iterable<CommentEntity> saveComments(
		Integer teamNumber,
		String secretCode,
		CreateCommentBulkRequest form
	) {
		OffsetDateTime currentTime = Instant.now()
			.atOffset(ZoneOffset.UTC)
			.truncatedTo(ChronoUnit.SECONDS);

		List<CommentEntity> comments = form.getComments()
			.stream()
			.map((singleCommentContent) -> {
				CommentEntity comment = new CommentEntity();
				comment.setTeamNumber(teamNumber);
				comment.setGameYear(form.getGameYear());
				comment.setEventCode(form.getEventCode());
				comment.setSecretCode(secretCode);
				comment.setMatchNumber(form.getMatchNumber());
				comment.setRobotNumber(form.getRobotNumber());
				comment.setTopic(singleCommentContent.getTopic());
				comment.setContent(singleCommentContent.getContent());
				comment.setTimeCreated(currentTime);

				return comment;
			})
			.toList();

		return commentRepository.saveAll(comments);
	}


	public List<CommentEntity> getCommentsForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		return commentRepository.findCommentsForEvent(
			teamNumber,
			gameYear,
			eventCode,
			secretCode
		);
	}

}
