package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.model.NewNote;
import team.gif.gearscout.model.NoteEntity;
import team.gif.gearscout.repository.NoteRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class NoteService {
	
	private final NoteRepository noteRepository;
	
	@Autowired
	public NoteService(NoteRepository noteRepository) {
		this.noteRepository = noteRepository;
	}
	
	public NoteEntity saveNote(
		NewNote note,
		Integer teamNumber,
		String secretCode
	) {
		String currentTime = Long.toString(System.currentTimeMillis());
		NoteEntity noteEntity = new NoteEntity(note, teamNumber, secretCode, currentTime);
		
		return noteRepository.save(noteEntity);
	}
	
	public List<NoteEntity> getAllNotesForTeam(
		Integer teamNumber,
		String secretCode,
		String eventCode,
		Integer robotNumber
	) {
		return noteRepository.findNoteEntriesByTeamNumberAndSecretCodeAndEventCodeAndRobotNumberOrderByTimeCreatedAsc(
			teamNumber, secretCode, eventCode, robotNumber
		);
	}
	
}
