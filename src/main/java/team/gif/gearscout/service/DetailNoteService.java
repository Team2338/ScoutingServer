package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.model.CreateDetailNoteRequest;
import team.gif.gearscout.model.DetailNoteEntity;
import team.gif.gearscout.model.DetailNoteQuestion;
import team.gif.gearscout.repository.DetailNoteRepository;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@Service
@Transactional
public class DetailNoteService {

	private final DetailNoteRepository noteRepository;

	@Autowired
	public DetailNoteService(DetailNoteRepository noteRepository) {
		this.noteRepository = noteRepository;
	}


	public List<DetailNoteEntity> saveNotes(
		Integer teamNumber,
		String secretCode,
		CreateDetailNoteRequest form
	) {
		List<DetailNoteEntity> notes = createNotesFromForm(
			teamNumber,
			secretCode,
			form
		);

		removeDuplicateQuestions(form);
		List<String> questionNames = getQuestionNames(form);
		noteRepository.removeNotesByQuestion( // Remove any duplicate questions
			teamNumber,
			form.getGameYear(),
			form.getRobotNumber(),
			form.getEventCode(),
			secretCode,
			questionNames
		);

		Iterable<DetailNoteEntity> dbResponse = noteRepository.saveAll(notes);
		List<DetailNoteEntity> results = new LinkedList<>();
		dbResponse.forEach(results::add);


		return results;
	}


	private List<String> getQuestionNames(CreateDetailNoteRequest form) {
		return form.getQuestions()
			.stream()
			.map(DetailNoteQuestion::getQuestion)
			.toList();
	}


	private void removeDuplicateQuestions(CreateDetailNoteRequest form) {
		HashMap<String, DetailNoteQuestion> uniqueQuestions = new HashMap<>();
		for (DetailNoteQuestion question : form.getQuestions()) {
			uniqueQuestions.put(question.getQuestion(), question);
		}

		List<DetailNoteQuestion> collectedUniqueQuestions = uniqueQuestions.values().stream().toList();
		form.setQuestions(collectedUniqueQuestions);
	}


	private List<DetailNoteEntity> createNotesFromForm(
		Integer teamNumber,
		String secretCode,
		CreateDetailNoteRequest form
	) {
		String currentTime = Long.toString(System.currentTimeMillis());
		return form.getQuestions()
			.stream()
			.map((question) -> {
				DetailNoteEntity note = new DetailNoteEntity();
				note.setTeamNumber(teamNumber);
				note.setGameYear(form.getGameYear());
				note.setEventCode(form.getEventCode());
				note.setSecretCode(secretCode);
				note.setRobotNumber(form.getRobotNumber());
				note.setCreator(question.getCreator());
				note.setQuestion(question.getQuestion());
				note.setAnswer(question.getAnswer());
				note.setTimeCreated(currentTime);

				return note;
			})
			.toList();
	}


	public List<DetailNoteEntity> getNotesForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		return noteRepository.findNotesForEvent(
			teamNumber,
			gameYear,
			eventCode,
			secretCode
		);
	}

}
