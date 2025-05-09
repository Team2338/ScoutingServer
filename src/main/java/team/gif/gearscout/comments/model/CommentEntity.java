package team.gif.gearscout.comments.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@Column(name = "event_id", nullable = false)
	private Long eventId;

	@Column(name = "team_number", nullable = false)
	@Min(0)
	private Integer teamNumber;

	@Column(name = "robot_number", nullable = false)
	@Min(0)
	private Integer robotNumber;

	@Column(name = "game_year", nullable = false)
	@Min(1995)
	private Integer gameYear;

	@Column(name = "match_number", nullable = false)
	@Min(0)
	private Integer matchNumber;

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

	public Long getEventId() {
		return eventId;
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

	public Integer getMatchNumber() {
		return matchNumber;
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

	public void setEventId(Long eventId) {
		this.eventId = eventId;
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

	public void setMatchNumber(Integer matchNumber) {
		this.matchNumber = matchNumber;
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
