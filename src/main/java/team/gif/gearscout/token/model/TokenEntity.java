package team.gif.gearscout.token.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tokens")
public class TokenEntity {

	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID tokenId;

	@Column(name = "user_id", nullable = false)
	private Long userId;

	@Column(name = "time_created", nullable = false)
	private OffsetDateTime timeCreated;


	public TokenEntity() {}

	public TokenEntity(Long userId, OffsetDateTime timeCreated) {
		this.userId = userId;
		this.timeCreated = timeCreated;
	}


	public UUID getTokenId() {
		return tokenId;
	}

	public Long getUserId() {
		return userId;
	}

	public OffsetDateTime getTimeCreated() {
		return timeCreated;
	}

	public void setTokenId(UUID tokenId) {
		this.tokenId = tokenId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public void setTimeCreated(OffsetDateTime timeCreated) {
		this.timeCreated = timeCreated;
	}

}
