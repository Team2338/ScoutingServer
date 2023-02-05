package team.gif.gearscout.model;

public class NewNote {
	
	private String eventCode;
	private Integer robotNumber;
	private String creator;
	private String content;
	
	public NewNote() {}
	
	public String getEventCode() {
		return eventCode;
	}
	
	public Integer getRobotNumber() {
		return robotNumber;
	}
	
	public String getCreator() {
		return creator;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setEventCode(String eventCode) {
		this.eventCode = eventCode;
	}
	
	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
}
