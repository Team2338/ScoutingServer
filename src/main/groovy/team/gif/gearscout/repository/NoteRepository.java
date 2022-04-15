package team.gif.gearscout.repository;

import org.springframework.data.repository.CrudRepository;
import team.gif.gearscout.model.NoteEntry;

import java.util.List;

public interface NoteRepository extends CrudRepository<NoteEntry, Long> {
	
	List<NoteEntry> findNoteEntriesByTeamNumberAndSecretCodeAndEventCodeAndRobotNumberOrderByTimeCreatedAsc(
		Integer teamNumber,
		String secretCode,
		String eventCode,
		Integer robotNumber
	);
	
}
