package team.gif.gearscout.token;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class UserEntity {

	@Id
	@Column(name = "user_id")
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "users_seq"
	)
	@SequenceGenerator(
		name = "users_seq",
		allocationSize = 5
	)
	private Long userId;

	@Column(name = "email", nullable = false)
	@Email
	private String email;

	@Column(name = "team_number", nullable = false)
	@Min(0)
	private Integer teamNumber;

	@Column(name = "username", nullable = false)
	@Size(min = 1, max = 32)
	private String username;

	@Column(name = "role", nullable = false)
	private String role;


	public UserEntity() {}



	public Long getUserId() {
		return userId;
	}

	public String getEmail() {
		return email;
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

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public void setEmail(String email) {
		this.email = email;
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
