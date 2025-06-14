package team.gif.gearscout.inspections.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.RobotNumberConstraint;

import java.util.List;

public class CreateInspectionRequest {

	@RobotNumberConstraint
	private Integer robotNumber;

	@GameYearConstraint
	private Integer gameYear;

	@EventCodeConstraint
	private String eventCode;

	@NotEmpty(message = "Questions list must not be empty")
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
