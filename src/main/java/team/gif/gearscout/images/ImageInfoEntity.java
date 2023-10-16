package team.gif.gearscout.images;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "image_info")
public class ImageInfoEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	private Boolean isPresent = false;
	
	@Column(name = "team_number", nullable = false)
	private Integer teamNumber;
	
	@Column(name = "game_year", nullable = false)
	private Integer gameYear;
	
	@Column(name = "event_code", nullable = false)
	private String eventCode;
	
	@Column(name = "secret_code", nullable = false)
	private String secretCode;
	
	@Column(name = "robot_number", nullable = false)
	private Integer robotNumber;
	
	@Column(name = "creator", nullable = false)
	private String creator;
	
	@Column(name = "imageId", nullable = false)
	private Long imageId;
	
	@Column(name = "time_created", nullable = false)
	private String timeCreated;
	
	
	public ImageInfoEntity() {}
	
	public ImageInfoEntity(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode,
		Integer robotNumber,
		String creator,
		Long imageId,
		String timeCreated
	) {
		this.teamNumber = teamNumber;
		this.gameYear = gameYear;
		this.eventCode = eventCode;
		this.secretCode = secretCode;
		this.robotNumber = robotNumber;
		this.creator = creator;
		this.imageId = imageId;
		this.timeCreated = timeCreated;
	}
	
	public Long getId() {
		return id;
	}
	
	public boolean isPresent() {
		return isPresent;
	}
	
	public Integer getTeamNumber() {
		return teamNumber;
	}
	
	public Integer getGameYear() {
		return gameYear;
	}
	
	public String getEventCode() {
		return eventCode;
	}
	
	public String getSecretCode() {
		return secretCode;
	}
	
	public Integer getRobotNumber() {
		return robotNumber;
	}
	
	public String getCreator() {
		return creator;
	}
	
	public Long getImageId() {
		return imageId;
	}
	
	public String getTimeCreated() {
		return timeCreated;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setIsPresent(boolean isPresent) {
		this.isPresent = isPresent;
	}
	
	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
	}
	
	public void setGameYear(Integer gameYear) {
		this.gameYear = gameYear;
	}
	
	public void setEventCode(String eventCode) {
		this.eventCode = eventCode;
	}
	
	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}
	
	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setImageId(Long imageId) {
		this.imageId = imageId;
	}
	
	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}
	
}
