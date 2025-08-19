package team.gif.gearscout.events;

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
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;

@Entity
@Table(name = "events")
public class EventEntity {

	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "events_seq"
	)
	@SequenceGenerator(
		name = "events_seq",
		allocationSize = 1
	)
	private Long id;

	@Column(nullable = false)
	@TeamNumberConstraint
	private Integer teamNumber;

	@Column(nullable = false)
	@GameYearConstraint
	private Integer gameYear;

	@Column(nullable = false)
	@EventCodeConstraint
	private String eventCode;

	@Column(nullable = false)
	@SecretCodeConstraint
	private String secretCode;

	@Column(nullable = false)
	private boolean shared;

	public EventEntity() {}

	public EventEntity(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		this.teamNumber = teamNumber;
		this.gameYear = gameYear;
		this.eventCode = eventCode;
		this.secretCode = secretCode;
	}

	public Long getId() {
		return id;
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

	public boolean isShared() {
		return shared;
	}

	public void setId(Long id) {
		this.id = id;
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

	public void setShared(boolean shared) {
		this.shared = shared;
	}
}
