package team.gif.gearscout.model;

public class NewImage {
	private Integer robotNumber;
	private String creator;
	private String timeCreated;
	
	public NewImage() {}
	
	
	public Integer getRobotNumber() {
		return robotNumber;
	}
	
	public String getCreator() {
		return creator;
	}
	
	public String getTimeCreated() {
		return timeCreated;
	}
	
	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}
	
}
