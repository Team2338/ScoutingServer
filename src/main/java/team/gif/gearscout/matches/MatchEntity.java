package team.gif.gearscout.matches;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "matches")
public class MatchEntity {
	
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
	private Integer matchNumber;
	
	@Column(nullable = false)
	private Integer robotNumber; // Team num of robot being scouted
	
	@Column(nullable = false)
	@Size(min = 1, max = 32)
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
		NewMatch match,
		Integer teamNumber,
		String secretCode,
		String timeCreated
	) {
		this.teamNumber = teamNumber;
		this.secretCode = secretCode;
		this.eventCode = match.getEventCode();
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
	
	
	public Integer getTeamNumber() {
		return teamNumber;
	}
	
	
	public String getSecretCode() {
		return secretCode;
	}
	
	
	public String getEventCode() {
		return eventCode;
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
	
	
	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
	}
	
	
	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}
	
	
	public void setEventCode(String eventCode) {
		this.eventCode = eventCode;
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