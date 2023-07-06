package team.gif.gearscout.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.model.DetailNoteEntity;

import java.util.List;

public interface DetailNoteRepository extends CrudRepository<DetailNoteEntity, Long> {

	@Query(value = """
	SELECT note
	FROM DetailNoteEntity note
	WHERE note.teamNumber = :teamNumber
		AND note.gameYear = :gameYear
		AND note.eventCode = :eventCode
		AND note.secretCode = :secretCode
	ORDER BY note.robotNumber, note.question ASC
	""")
	List<DetailNoteEntity> findNotesForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	);

	@Query(value = """
	DELETE
	FROM DetailNoteEntity note
	WHERE note.teamNumber = :teamNumber
		AND note.gameYear = :gameYear
		AND note.robotNumber = :robotNumber
		AND note.eventCode = :eventCode
		AND note.secretCode = :secretCode
		AND note.question IN :questions
	""")
	void removeNotesByQuestion(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String eventCode,
		String secretCode,
		List<String> questions
	);

}
