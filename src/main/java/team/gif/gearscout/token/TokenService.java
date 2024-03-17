package team.gif.gearscout.token;

import jakarta.transaction.Transactional;
import org.antlr.v4.runtime.Token;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@Transactional
public class TokenService {

	@Value("${jwt.secret}")
	private String secret;

	private final BCryptPasswordEncoder encoder;
	private static final Logger logger = LogManager.getLogger(TokenService.class);

	@Autowired
	public TokenService() {
		this.encoder = new BCryptPasswordEncoder();
	}

	// TODO: add something to make each token with the same ID and role unique? -> timestamp
	public String generateToken(Long userId, String role) {
		// TODO: Create token object
		TokenModel token = new TokenModel("HS256", userId, role);

		Base64.Encoder tokenEncoder = Base64.getEncoder();
		String encodedHeader = tokenEncoder.encodeToString("".getBytes(StandardCharsets.UTF_8));
		String encodedPayload = tokenEncoder.encodeToString("".getBytes(StandardCharsets.UTF_8));
		String signature = generateSignature(encodedHeader, encodedPayload);

		return encodedHeader + "." + encodedPayload + "." + signature;
	}

	private String generateSignature(String header, String payload) {
		String body = header + "." + payload;
		byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);

		try {
			final String algorithm = "HmacSHA256";
			Mac hmac = Mac.getInstance(algorithm);
			SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), algorithm);
			hmac.init(secretKey);

			return Base64.getUrlEncoder().encodeToString(hmac.doFinal(bodyBytes));
		} catch (NoSuchAlgorithmException e) {
			logger.error("Invalid HMAC algorithm for token signing");
			throw new RuntimeException(e);
		} catch (InvalidKeyException e) {
			logger.error("Invalid secret key spec for token signing");
			throw new RuntimeException(e);
		}
	}

	public void validateToken(String token) throws ResponseStatusException {
		validateTokenStructure(token);
		validateTokenIntegrity(token);
		// TODO: get data from database
	}

	/**
	 * Ensure this token string can actually be parsed as a token.
	 *
	 * @param token The auth token
	 * @throws ResponseStatusException If the token is malformed - Unauthorized
	 */
	private void validateTokenStructure(String token) throws ResponseStatusException {
		String[] tokenParts = token.split("\\.");
		if (tokenParts.length != 3) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Malformed token");
		}
	}

	/**
	 * Ensure content matches signature.
	 *
	 * @param token The auth token
	 * @throws ResponseStatusException If the content does not match the signature - Unauthorized
	 */
	private void validateTokenIntegrity(String token) throws ResponseStatusException {
		String[] tokenParts = token.split("\\.");

		String header = tokenParts[0];
		String payload = tokenParts[1];
		String givenSignature = tokenParts[2];
		String actualSignature = generateSignature(header, payload);

		if (!givenSignature.equals(actualSignature)) {
			// We give a generic message so nobody can brute force the secret
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
	}

}
