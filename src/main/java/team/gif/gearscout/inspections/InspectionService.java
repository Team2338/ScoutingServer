package team.gif.gearscout.inspections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@Service
@Transactional
public class InspectionService {

	private final InspectionRepository inspectionRepository;

	@Autowired
	public InspectionService(InspectionRepository inspectionRepository) {
		this.inspectionRepository = inspectionRepository;
	}


	public List<InspectionEntity> saveInspections(
		Long eventId,
		Integer teamNumber,
		CreateInspectionRequest form
	) {
		List<InspectionEntity> inspections = createInspectionsFromForm(
			eventId,
			teamNumber,
			form
		);

		removeDuplicateQuestions(form);
		List<String> questionNames = getQuestionNames(form);
		inspectionRepository.removeInspectionsByQuestion( // Remove any duplicate questions from DB
			eventId,
			form.getRobotNumber(),
			questionNames
		);

		Iterable<InspectionEntity> dbResponse = inspectionRepository.saveAll(inspections);
		List<InspectionEntity> results = new LinkedList<>();
		dbResponse.forEach(results::add);

		return results;
	}


	private List<String> getQuestionNames(CreateInspectionRequest form) {
		return form.getQuestions()
			.stream()
			.map(InspectionQuestion::getQuestion)
			.toList();
	}


	private void removeDuplicateQuestions(CreateInspectionRequest form) {
		HashMap<String, InspectionQuestion> uniqueQuestions = new HashMap<>();
		for (InspectionQuestion question : form.getQuestions()) {
			uniqueQuestions.put(question.getQuestion(), question);
		}

		List<InspectionQuestion> collectedUniqueQuestions = uniqueQuestions.values().stream().toList();
		form.setQuestions(collectedUniqueQuestions);
	}


	private List<InspectionEntity> createInspectionsFromForm(
		Long eventId,
		Integer teamNumber,
		CreateInspectionRequest form
	) {
		String currentTime = Long.toString(System.currentTimeMillis());
		return form.getQuestions()
			.stream()
			.map((question) -> {
				InspectionEntity inspection = new InspectionEntity();
				inspection.setEventId(eventId);
				inspection.setTeamNumber(teamNumber);
				inspection.setGameYear(form.getGameYear());
				inspection.setRobotNumber(form.getRobotNumber());
				inspection.setCreator(question.getCreator());
				inspection.setQuestion(question.getQuestion());
				inspection.setAnswer(question.getAnswer());
				inspection.setTimeCreated(currentTime);

				return inspection;
			})
			.toList();
	}


	public List<InspectionEntity> getInspectionsForEvent(Long eventId) {
		return inspectionRepository.findInspectionsForEvent(eventId);
	}

}
