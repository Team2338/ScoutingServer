package team.gif.gearscout.comments;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CommentRepository extends CrudRepository<CommentEntity, Long> {

	@Query(value = """
	SELECT comment
	FROM CommentEntity comment
	WHERE comment.teamNumber = :teamNumber
		AND comment.gameYear = :gameYear
		AND comment.eventCode = :eventCode
		AND comment.secretCode = :secretCode
	ORDER BY comment.robotNumber, comment.topic ASC
	""")
	List<CommentEntity> findCommentsForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	);

}
