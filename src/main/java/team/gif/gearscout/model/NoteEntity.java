package team.gif.gearscout.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;

@Entity
@Table(name = "notes")
public class NoteEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	@Column(nullable = false)
	private Integer teamNumber; // Team num of data collector
	
	@Column(nullable = false)
	private String secretCode; // For restricting access to team's data
	
	@Column(nullable = false)
	@Size(min = 1, max = 32)
	private String eventCode;
	
	@Column(nullable = false)
	private Integer robotNumber; // Team num of robot being scouted
	
	@Column(nullable = false)
	@Size(min = 1, max = 32)
	private String creator; // Username of the scouter that created this entry
	
	@Column(nullable = false)
	private String content;
	
	@Column(nullable = false)
	private String timeCreated;
	
	
	public NoteEntity() {}
	
	public NoteEntity(
		NewNote note,
		Integer teamNumber,
		String secretCode,
		String timeCreated
	) {
		this.teamNumber = teamNumber;
		this.secretCode = secretCode;
		this.eventCode = note.getEventCode();
		this.robotNumber = note.getRobotNumber();
		this.creator = note.getCreator();
		this.content = note.getContent();
		this.timeCreated = timeCreated;
	}
	
	public Long getId() {
		return id;
	}
	
	public Integer getTeamNumber() {
		return teamNumber;
	}
	
	public String getSecretCode() {
		return secretCode;
	}
	
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
	
	public String getTimeCreated() {
		return timeCreated;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
	}
	
	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
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
	
	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}
	
}
