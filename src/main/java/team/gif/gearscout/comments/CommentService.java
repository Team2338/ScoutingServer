package team.gif.gearscout.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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


	public CommentEntity saveComment(
		Integer teamNumber,
		String secretCode,
		CreateCommentRequest form
	) {
		OffsetDateTime currentTime = Instant.now()
			.atOffset(ZoneOffset.UTC)
			.truncatedTo(ChronoUnit.SECONDS);

		CommentEntity comment = new CommentEntity();
		comment.setTeamNumber(teamNumber);
		comment.setGameYear(form.getGameYear());
		comment.setEventCode(form.getEventCode());
		comment.setSecretCode(secretCode);
		comment.setRobotNumber(form.getRobotNumber());
		comment.setCreator(form.getCreator());
		comment.setTopic(form.getTopic());
		comment.setContent(form.getContent());
		comment.setTimeCreated(currentTime);

		return commentRepository.save(comment);
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
