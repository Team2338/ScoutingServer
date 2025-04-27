package team.gif.gearscout.images.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "image_info")
public class ImageInfoEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "image_info_seq"
	)
	@SequenceGenerator(
		name = "image_info_seq",
		allocationSize = 1
	)
	private Long id;

	@Column(name = "event_id", nullable = false)
	private Long eventId;
	
	@Column(name = "team_number", nullable = false)
	private Integer teamNumber;
	
	@Column(name = "game_year", nullable = false)
	private Integer gameYear;
	
	@Column(name = "robot_number", nullable = false)
	private Integer robotNumber;
	
	@Column(name = "creator", nullable = false)
	private String creator;
	
	@Column(name = "imageId", nullable = false)
	private UUID imageId;
	
	@Column(name = "time_created", nullable = false)
	private String timeCreated;
	
	
	public ImageInfoEntity() {}
	
	public ImageInfoEntity(
		Long eventId,
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String creator,
		UUID imageId,
		String timeCreated
	) {
		this.eventId = eventId;
		this.teamNumber = teamNumber;
		this.gameYear = gameYear;
		this.robotNumber = robotNumber;
		this.creator = creator;
		this.imageId = imageId;
		this.timeCreated = timeCreated;
	}


	public Long getId() {
		return id;
	}

	public Long getEventId() {
		return eventId;
	}

	public Integer getTeamNumber() {
		return teamNumber;
	}
	
	public Integer getGameYear() {
		return gameYear;
	}
	
	public Integer getRobotNumber() {
		return robotNumber;
	}
	
	public String getCreator() {
		return creator;
	}
	
	public UUID getImageId() {
		return imageId;
	}
	
	public String getTimeCreated() {
		return timeCreated;
	}

	
	public void setId(Long id) {
		this.id = id;
	}

	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}

	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
	}
	
	public void setGameYear(Integer gameYear) {
		this.gameYear = gameYear;
	}
	
	public void setRobotNumber(Integer robotNumber) {
		this.robotNumber = robotNumber;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setImageId(UUID imageId) {
		this.imageId = imageId;
	}
	
	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}
	
}
