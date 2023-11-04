package team.gif.gearscout.comments;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

public class CreateCommentRequest {

	@Min(0)
	private Integer robotNumber;

	@Min(1995)
	private Integer gameYear;

	@Size(min = 1, max = 32)
	private String eventCode;

	@Min(0)
	private Integer matchNumber;

	@Size(min = 1, max = 32)
	private String topic;

	@Size(min = 1, max = 1024)
	private String content;

	@Size(min = 1, max = 32)
	private String creator;

	public CreateCommentRequest() {}

	public Integer getRobotNumber() {
		return robotNumber;
	}

	public Integer getGameYear() {
		return gameYear;
	}

	public String getEventCode() {
		return eventCode;
	}

	public Integer getMatchNumber() {
		return matchNumber;
	}

	public String getTopic() {
		return topic;
	}

	public String getContent() {
		return content;
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

	public void setMatchNumber(Integer matchNumber) {
		this.matchNumber = matchNumber;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

}
