package team.gif.gearscout.comments.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;

import java.util.List;

public class CreateCommentBulkRequest {

	@NotNull(message = "Field 'robotNumber' must not be null")
	@Min(value = 0, message = "Field 'robotNumber' must be > 0")
	private Integer robotNumber;

	@GameYearConstraint
	private Integer gameYear;

	@NotNull(message = "Field 'eventCode' must not be null")
	@EventCodeConstraint
	private String eventCode;

	@NotNull(message = "Field 'matchNumber' must not be null")
	@Min(value = 0, message = "Field 'matchNumber' must be > 0")
	private Integer matchNumber;

	@NotNull(message = "Field 'creator' must not be null")
	@Size(min = 1, max = 32, message = "Field 'creator' must have length between 1 - 32")
	private String creator;

	@NotNull(message = "Field 'comments' must not be null")
	@NotEmpty(message = "Comments list must not be empty")
	private List<@Valid SingleCommentContent> comments;


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
