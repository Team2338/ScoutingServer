package team.gif.gearscout.token;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class TokenModel {
	private static final Logger logger = LogManager.getLogger(TokenModel.class);

	/**
	 * Deserialize a token from the header and payload.
	 *
	 * @param header The serialized header of a token
	 * @param payload The serialized payload of a token
	 * @return The deserialized token
	 * @throws ResponseStatusException If an error occurs while parsing
	 */
	public static TokenModel parse(String header, String payload) {
		ObjectMapper mapper = new ObjectMapper();

		try {
			Header parsedHeader = mapper.readValue(header, Header.class);
			Payload parsedPayload = mapper.readValue(payload, Payload.class);

			return new TokenModel(parsedHeader, parsedPayload);
		} catch (JsonProcessingException e) {
			logger.error("Failed to deserialize token", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
		}
	}

	private final Header header;
	private final Payload payload;


	private TokenModel(Header header, Payload payload) {
		this.header = header;
		this.payload = payload;
	}

	public TokenModel(String algorithm, UUID tokenId, Long userId, String role) {
		header = new Header("JWT", algorithm);


		Instant creationTime = Instant.now().truncatedTo(ChronoUnit.SECONDS);
		String timestamp = creationTime.toString();
		payload = new Payload(
			"GearScout",
			tokenId,
			timestamp,
			userId + "",
			role
		);
	}


	public UUID getTokenId() {
		return payload.jti;
	}

	public String getHeader() {
		ObjectMapper mapper = new ObjectMapper();

		try {
			return mapper.writeValueAsString(header);
		} catch (JsonProcessingException e) {
			logger.error("Failed to serialize header", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
		}
	}

	public String getPayload() {
		ObjectMapper mapper = new ObjectMapper();

		try {
			return mapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			logger.error("Failed to serialize payload", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
		}
	}


	/**
	 * Represents the header section of a JWT.
	 *
	 * @param typ The type of the token (ie "JWT")
	 * @param alg Hash algorithm used for the signature
	 */
	private record Header(String typ, String alg) {}

	/**
	 * Represents the payload section of a JWT.
	 *
	 * @param iss (Issuer) Name of application issuing the token
	 * @param jti (JWT ID) Unique ID of the JWT
	 * @param iat (Issued At) Date at which the token was generated
	 * @param sub (Subject) User ID
	 * @param rol Role of the user
	 */
	private record Payload(
		String iss,
		UUID jti,
		String iat,
		String sub,
		String rol
	) {}
}
