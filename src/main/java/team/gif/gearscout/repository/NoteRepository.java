package team.gif.gearscout.repository;

import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.model.NoteEntity;

import java.util.List;

public interface NoteRepository extends CrudRepository<NoteEntity, Long> {
	
	List<NoteEntity> findNoteEntriesByTeamNumberAndSecretCodeAndEventCodeAndRobotNumberOrderByTimeCreatedAsc(
		Integer teamNumber,
		String secretCode,
		String eventCode,
		Integer robotNumber
	);
	
	List<NoteEntity> findNoteEntriesByTeamNumberAndSecretCodeAndEventCodeOrderByTimeCreatedAsc(
		Integer teamNumber,
		String secretCode,
		String eventCode
	);
	
}
