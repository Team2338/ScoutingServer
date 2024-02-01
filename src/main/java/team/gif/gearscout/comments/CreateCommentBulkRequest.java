package team.gif.gearscout.comments;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.util.List;

public class CreateCommentBulkRequest {

	@Min(0)
	private Integer robotNumber;

	@Min(1995)
	private Integer gameYear;

	@Size(min = 1, max = 32)
	private String eventCode;

	@Min(0)
	private Integer matchNumber;

	@Size(min = 1, max = 32)
	private String creator;

	private List<SingleCommentContent> comments;


	public CreateCommentBulkRequest() {}

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

	public String getCreator() {
		return creator;
	}

	public List<SingleCommentContent> getComments() {
		return comments;
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

	public void setComments(List<SingleCommentContent> comments) {
		this.comments = comments;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

}
