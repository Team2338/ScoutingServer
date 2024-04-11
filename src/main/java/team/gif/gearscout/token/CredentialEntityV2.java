package team.gif.gearscout.token;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "credentials")
public class CredentialEntityV2 {

	@Id
	@Column(name = "user_id")
	private Long userId; // Foreign key

	@Column(name = "password", nullable = false)
	private String password;


	public CredentialEntityV2() {}

	public CredentialEntityV2(Long userId, String password) {
		this.userId = userId;
		this.password = password;
	}


	public Long getUserId() {
		return userId;
	}

	public String getPassword() {
		return password;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
