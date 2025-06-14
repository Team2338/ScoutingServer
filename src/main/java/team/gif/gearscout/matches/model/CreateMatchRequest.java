package team.gif.gearscout.matches.model;

import jakarta.validation.constraints.NotEmpty;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.MatchNumberConstraint;
import team.gif.gearscout.shared.validation.RobotNumberConstraint;
import team.gif.gearscout.shared.validation.UsernameConstraint;

import java.util.List;

public class CreateMatchRequest {

	@GameYearConstraint
	private Integer gameYear;

	@EventCodeConstraint
	private String eventCode;

	@MatchNumberConstraint
	private Integer matchNumber;

	@RobotNumberConstraint
	private Integer robotNumber;

	@UsernameConstraint
	private String creator;

	private String allianceColor;

	@NotEmpty(message = "Objectives list must not be empty")
	private List<ObjectiveEntity> objectives;
	
	public CreateMatchRequest() {}
	

	public Integer getGameYear() {
		return gameYear;
	}

	public String getEventCode() {
		return eventCode;
	}
	
	public Integer getMatchNumber() {
		return matchNumber;
	}
	
	public Integer getRobotNumber() {
		return robotNumber;
	}
	
	public String getCreator() {
		return creator;
	}
	
	public String getAllianceColor() {
		return allianceColor;
	}
	
	public List<ObjectiveEntity> getObjectives() {
		return this.objectives;
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
	
	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setObjectives(List<ObjectiveEntity> objectives) {
		this.objectives = objectives;
	}
	
	public void setAllianceColor(String color) {
		this.allianceColor = color;
	}
	
}
