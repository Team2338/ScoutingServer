package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.model.CreateDetailNoteRequest;
import team.gif.gearscout.model.DetailNoteEntity;
import team.gif.gearscout.repository.DetailNoteRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class DetailNoteService {

	private final DetailNoteRepository noteRepo;

	@Autowired
	public DetailNoteService(DetailNoteRepository noteRepo) {
		this.noteRepo = noteRepo;
	}


	public DetailNoteEntity saveNote(
		Integer teamNumber,
		String secretCode,
		CreateDetailNoteRequest note
	) {
		String currentTime = Long.toString(System.currentTimeMillis());
		DetailNoteEntity complete = new DetailNoteEntity(
			note,
			teamNumber,
			secretCode,
			currentTime
		);

		return noteRepo.save(complete);
	}


	public List<DetailNoteEntity> getNotesForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		return noteRepo.findNotesForEvent(
			teamNumber,
			gameYear,
			eventCode,
			secretCode
		);
	}

}
