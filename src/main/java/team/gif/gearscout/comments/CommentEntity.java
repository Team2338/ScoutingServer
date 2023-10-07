package team.gif.gearscout.comments;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;

@Entity
@Table(name = "comments")
public class CommentEntity {

	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "comments_seq"
	)
	@SequenceGenerator(
		name = "comments_seq",
		allocationSize = 1
	)
	private Long id;

	@Column(name = "team_number", nullable = false)
	@Min(0)
	private Integer teamNumber;

	@Column(name = "robot_number", nullable = false)
	@Min(0)
	private Integer robotNumber;

	@Column(name = "game_year", nullable = false)
	@Min(1995)
	private Integer gameYear;

	@Column(name = "event_code", nullable = false)
	@Size(min = 1, max = 32)
	private String eventCode;

	@Column(name = "secret_code", nullable = false)
	@Size(min = 1, max = 32)
	private String secretCode;

	@Column(name = "topic", nullable = false)
	@Size(min = 1, max = 32)
	private String topic;

	@Column(name = "content", nullable = false)
	@Size(min = 1, max = 1024)
	private String content;

	@Column(name = "creator", nullable = false)
	@Size(min = 1, max = 32)
	private String creator;

	@Column(name = "time_created", nullable = false)
	private OffsetDateTime timeCreated;

	public CommentEntity() {}

	public Long getId() {
		return id;
	}

	public Integer getTeamNumber() {
		return teamNumber;
	}

	public Integer getRobotNumber() {
		return robotNumber;
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

	public String getTopic() {
		return topic;
	}

	public String getContent() {
		return content;
	}

	public String getCreator() {
		return creator;
	}

	public OffsetDateTime getTimeCreated() {
		return timeCreated;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
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

	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public void setTimeCreated(OffsetDateTime timeCreated) {
		this.timeCreated = timeCreated;
	}

}
