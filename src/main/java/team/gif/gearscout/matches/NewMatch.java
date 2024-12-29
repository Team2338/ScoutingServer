package team.gif.gearscout.matches;

import java.util.List;

public class NewMatch {

	// TODO: Shouldn't we be performing property validation here???
	private Integer gameYear;
	private String eventCode;
	private Integer matchNumber;
	private Integer robotNumber;
	private String creator;
	private String allianceColor;
	
	private List<ObjectiveEntity> objectives;
	
	public NewMatch() {}
	

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
