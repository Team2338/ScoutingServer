package team.gif.gearscout.inspections;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreateInspectionRequest {

	@Min(0)
	private Integer robotNumber;

	@Min(1995)
	private Integer gameYear;

	@Size(min = 1, max = 32)
	private String eventCode;

	@NotEmpty
	private List<InspectionQuestion> questions;


	public CreateInspectionRequest() {}


	public Integer getRobotNumber() {
		return robotNumber;
	}

	public Integer getGameYear() {
		return gameYear;
	}

	public String getEventCode() {
		return eventCode;
	}

	public List<InspectionQuestion> getQuestions() {
		return questions;
	}

	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}

	public void setGameYear(Integer gameYear) {
		this.gameYear = gameYear;
	}

	public void setEventCode(String eventCode) {
		this.eventCode = eventCode;
	}

	public void setQuestions(List<InspectionQuestion> questions) {
		this.questions = questions;
	}

}
