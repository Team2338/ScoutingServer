package team.gif.gearscout.inspections.model;

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
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.RobotNumberConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;
import team.gif.gearscout.shared.validation.UsernameConstraint;

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

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@Column(name = "event_id", nullable = false)
	private Long eventId;

	@Column(name = "team_number", nullable = false)
	@TeamNumberConstraint
	private Integer teamNumber;

	@Column(name = "robot_number", nullable = false)
	@RobotNumberConstraint
	private Integer robotNumber;

	@Column(name = "game_year", nullable = false)
	@GameYearConstraint
	private Integer gameYear;

	@Column(name = "question", nullable = false)
	@Size(min = 1, max = 32)
	private String question;

	@Column(name = "answer", nullable = false)
	@Size(max = 1024)
	private String answer;

	@Column(name = "creator", nullable = false)
	@UsernameConstraint
	private String creator;

	@Column(name = "time_created", nullable = false)
	@Size(min = 1, max = 32)
	private String timeCreated;


	public InspectionEntity() {}

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
