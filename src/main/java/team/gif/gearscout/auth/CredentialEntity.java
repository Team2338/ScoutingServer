package team.gif.gearscout.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth")
public class CredentialEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "auth_seq"
	)
	@SequenceGenerator(
		name = "auth_seq",
		allocationSize = 1
	)
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
