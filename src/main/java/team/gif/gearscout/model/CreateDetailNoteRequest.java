package team.gif.gearscout.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

public class CreateDetailNoteRequest {

	@Min(0)
	private Integer robotNumber;

	@Min(1995)
	private Integer gameYear;

	@Size(min = 1, max = 32)
	private String eventCode;

	@Size(min = 1, max = 32)
	private String question;

	@Size(min = 1, max = 32)
	private String answer;

	@Size(min = 1, max = 32)
	private String creator;


	public CreateDetailNoteRequest() {}


	public Integer getRobotNumber() {
		return robotNumber;
	}

	public Integer getGameYear() {
		return gameYear;
	}

	public String getEventCode() {
		return eventCode;
	}

	public String getQuestion() {
		return question;
	}

	public String getAnswer() {
		return answer;
	}

	public String getCreator() {
		return creator;
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

	public void setQuestion(String question) {
		this.question = question;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

}
