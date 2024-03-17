package team.gif.gearscout.token;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TokenModel {
	private final Header header;
	private final Payload payload;

	public TokenModel(String algorithm, Long userId, String role) {
		header = new Header("JWT", algorithm);

		// TODO: make unique ID and timestamp
		payload = new Payload(
			"GearScout",
			userId + "",
			role
		);
	}

	public String getHeader() {
		ObjectMapper mapper = new ObjectMapper();

		try {
			return mapper.writeValueAsString(header);
		} catch (JsonProcessingException e) {
			throw new TokenCreationException();
		}
	}

	public String getPayload() {
		ObjectMapper mapper = new ObjectMapper();

		try {
			return mapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			throw new TokenCreationException();
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
		String jti,
		String iat,
		String sub,
		String rol
	) {}
}
