package team.gif.gearscout.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "auth")
public class CredentialEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	@Column(name = "team_number")
	private Integer teamNumber;
	
	@Column(name = "username")
	private String username;
	
	@Column(name = "role")
	private String role;
	
	public CredentialEntity() {}
	
	
	public Long getId() {
		return id;
	}
	
	public Integer getTeamNumber() {
		return teamNumber;
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getRole() {
		return role;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setTeamNumber(Integer teamNumber) {
		this.teamNumber = teamNumber;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setRole(String role) {
		this.role = role;
	}
	
}
