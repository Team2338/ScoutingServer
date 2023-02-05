package team.gif.gearscout.model;

import java.util.List;

public class NewMatch {
	
	private String eventCode;
	private Integer matchNumber;
	private Integer robotNumber;
	private String creator;
	
	private List<ObjectiveEntity> objectives;
	
	public NewMatch() {}
	
	
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
	
	public List<ObjectiveEntity> getObjectives() {
		return this.objectives;
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
	
}
