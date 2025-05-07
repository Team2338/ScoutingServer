package team.gif.gearscout.matches.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.SequenceGenerator;
import org.hibernate.annotations.JdbcTypeCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "objectives")
public class ObjectiveEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "objectives_seq"
	)
	@SequenceGenerator(
		name = "objectives_seq",
		allocationSize = 1
	)
	private Long id;
	
	@ManyToOne
	private MatchEntity match;
	
	@Column(nullable = false)
	@Size(min = 1, max = 64)
	private String gamemode;
	
	@Column(nullable = false)
	@Size(min = 1, max = 128)
	private String objective;
	
	@Column(nullable = false)
	private Integer count;

	@Column(columnDefinition = "int[]", nullable = true)
	@JdbcTypeCode(SqlTypes.ARRAY)
	@Size(max = 128, message = "Objective.list may not contain more than 128 scores")
	private Integer[] list;
	
	
	public Long getId() {
		return id;
	}
	
	public MatchEntity getMatch() {
		return match;
	}
	
	public String getGamemode() {
		return gamemode;
	}
	
	public String getObjective() {
		return objective;
	}
	
	public Integer getCount() {
		return count;
	}
	
	public Integer[] getList() {
		return list;
	}

	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setMatch(MatchEntity match) {
		this.match = match;
	}
	
	public void setGamemode(String gamemode) {
		this.gamemode = gamemode;
	}
	
	public void setObjective(String objective) {
		this.objective = objective;
	}
	
	public void setCount(Integer count) {
		this.count = count;
	}
	
	public void setList(Integer[] list) {
		this.list = list;
	}
	
}
