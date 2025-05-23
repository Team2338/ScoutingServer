package team.gif.gearscout.matches.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.MatchNumberConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;
import team.gif.gearscout.shared.validation.UsernameConstraint;

import java.util.List;

@Entity
@Table(name = "matches")
public class MatchEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "matches_seq"
	)
	@SequenceGenerator(
		name = "matches_seq",
		allocationSize = 1
	)
	private Long id;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@Column(nullable = false)
	private Long eventId;

	@Column(nullable = false)
	@GameYearConstraint
	private Integer gameYear;
	
	@Column(nullable = false)
	@TeamNumberConstraint
	private Integer teamNumber; // Team num of data collector

	@Column(nullable = false)
	@MatchNumberConstraint
	private Integer matchNumber;
	
	@Column(nullable = false)
	@TeamNumberConstraint
	private Integer robotNumber; // Team num of robot being scouted
	
	@Column(nullable = false)
	@UsernameConstraint
	private String creator; // Username of the scouter that created this entry
	
//	@Column(nullable = false) // TODO: make this non-null
	@Column(nullable = true)
	@Size(min = 1, max = 32)
	private String allianceColor;
	
	@Column(nullable = false)
	@Size(min = 8, max = 64)
	private String timeCreated;
	
	@Column(nullable = false)
	private boolean isHidden;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	List<ObjectiveEntity> objectives;
	
	
	public MatchEntity() {}
	
	public MatchEntity(
		Long eventId,
		CreateMatchRequest match,
		Integer teamNumber,
		String timeCreated
	) {
		this.eventId = eventId;
		this.gameYear = match.getGameYear();
		this.teamNumber = teamNumber;
		this.matchNumber = match.getMatchNumber();
		this.robotNumber = match.getRobotNumber();
		this.creator = match.getCreator();
		this.allianceColor = match.getAllianceColor();
		this.timeCreated = timeCreated;
		this.isHidden = false;
		this.objectives = match.getObjectives();
	}
	
	
	public Long getId() {
		return id;
	}

	public Long getEventId() {
		return eventId;
	}

	public Integer getGameYear() {
		return gameYear;
	}

	public Integer getTeamNumber() {
		return teamNumber;
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
	
	public String getAllianceColor() {
		return allianceColor;
	}
	
	public String getTimeCreated() {
		return timeCreated;
	}
	
	public boolean getIsHidden() {
		return isHidden;
	}
	
	public List<ObjectiveEntity> getObjectives() {
		return objectives;
	}
	
	
	public void setId(Long id) {
		this.id = id;
	}

	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}

	public void setGameYear(Integer gameYear) {
		this.gameYear = gameYear;
	}
	
	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
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

	public void setAllianceColor(String color) {
		this.allianceColor = color;
	}

	public void setTimeCreated(String timeCreated) {
		this.timeCreated = timeCreated;
	}
	
	public void setIsHidden(boolean isHidden) {
		this.isHidden = isHidden;
	}

	public void setObjectives(List<ObjectiveEntity> objectives) {
		this.objectives = objectives;
	}
	
}
