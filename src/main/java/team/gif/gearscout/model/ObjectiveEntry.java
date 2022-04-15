package team.gif.gearscout.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Size;

@Entity
@Table(name = "objectives")
public class ObjectiveEntry {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	@ManyToOne
	private MatchEntry match;
	
	@Column
	@Size(min = 1, max = 64)
	private String gamemode;
	
	@Column(nullable = false)
	@Size(min = 1, max = 128)
	private String objective;
	
	@Column(nullable = false)
	private Integer count;
	
	
	public Long getId() {
		return id;
	}
	
	public MatchEntry getMatch() {
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
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setMatch(MatchEntry match) {
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
	
}
