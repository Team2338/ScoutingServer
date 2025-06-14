package team.gif.gearscout.comments;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.comments.model.CommentEntity;

import java.util.List;

public interface CommentRepository extends CrudRepository<CommentEntity, Long> {

	@Query(value = """
	SELECT comment
	FROM CommentEntity comment
	WHERE comment.eventId = :eventId
	ORDER BY comment.robotNumber, comment.topic ASC
	""")
	List<CommentEntity> findCommentsByEventId(Long eventId);

}
