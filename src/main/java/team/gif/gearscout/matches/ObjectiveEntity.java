package team.gif.gearscout.matches;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;
import team.gif.gearscout.matches.MatchEntity;

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
public class ObjectiveEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	@ManyToOne
	private MatchEntity match;
	
	@Column
	@Size(min = 1, max = 64)
	private String gamemode;
	
	@Column(nullable = false)
	@Size(min = 1, max = 128)
	private String objective;
	
	@Column(nullable = false)
	private Integer count;
	
	@Column(columnDefinition = "int[]", nullable = true)
	@Type(type = "team.gif.gearscout.repository.PostgresIntegerArrayType")
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
