package team.gif.gearscout.comments.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.MatchNumberConstraint;
import team.gif.gearscout.shared.validation.RobotNumberConstraint;
import team.gif.gearscout.shared.validation.UsernameConstraint;

import java.util.List;

public class CreateCommentBulkRequest {

	@RobotNumberConstraint
	private Integer robotNumber;

	@GameYearConstraint
	private Integer gameYear;

	@EventCodeConstraint
	private String eventCode;

	@MatchNumberConstraint
	private Integer matchNumber;

	@UsernameConstraint
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
