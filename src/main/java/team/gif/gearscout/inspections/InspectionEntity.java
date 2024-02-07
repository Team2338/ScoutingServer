package team.gif.gearscout.inspections;

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

@Entity
@Table(name = "detail_notes")
public class InspectionEntity {

	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "detail_notes_seq"
	)
	@SequenceGenerator(
		name = "detail_notes_seq",
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

	@Column(name = "question", nullable = false)
	@Size(min = 1, max = 32)
	private String question;

	@Column(name = "answer", nullable = false)
	@Size(min = 1, max = 1024)
	private String answer;

	@Column(name = "creator", nullable = false)
	@Size(min = 1, max = 32)
	private String creator;

	@Column(name = "time_created", nullable = false)
	@Size(min = 1, max = 32)
	private String timeCreated;


	public InspectionEntity() {}

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

	public String getQuestion() {
		return question;
	}

	public String getAnswer() {
		return answer;
	}

	public String getCreator() {
		return creator;
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

	public void setQuestion(String question) {
		this.question = question;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}

}
