package team.gif.gearscout.token;

import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
public class TokenService {

	@Value("${jwt.secret}")
	private String secret;

	private static final Logger logger = LogManager.getLogger(TokenService.class);
	private final TokenRepository tokenRepository;

	@Autowired
	public TokenService(TokenRepository tokenRepository) {
		this.tokenRepository = tokenRepository;
	}


	public String generateAndSaveToken(Long userId, String role, Integer teamNumber) {
		OffsetDateTime currentTime = Instant.now()
			.atOffset(ZoneOffset.UTC)
			.truncatedTo(ChronoUnit.SECONDS);
		TokenEntity tokenEntity = new TokenEntity(userId, currentTime);

		tokenEntity = tokenRepository.save(tokenEntity);

		TokenModel token = new TokenModel("HS256", tokenEntity.getTokenId(), userId, role, teamNumber);

		Base64.Encoder tokenEncoder = Base64.getUrlEncoder();
		String encodedHeader = tokenEncoder.encodeToString(token.getHeader().getBytes(StandardCharsets.UTF_8));
		String encodedPayload = tokenEncoder.encodeToString(token.getPayload().getBytes(StandardCharsets.UTF_8));
		String signature = generateSignature(encodedHeader, encodedPayload);

		return encodedHeader + "." + encodedPayload + "." + signature;
	}

	public Long validateToken(String token) throws ResponseStatusException {
		validateTokenStructure(token);
		validateTokenIntegrity(token);
		TokenModel tokenModel = parseToken(token);
		validateTokenExistence(tokenModel);

		return tokenModel.getUserId();
	}


	/**
	 * Create a hash string signature from the content of the token.
	 *
	 * @param header The token's header
	 * @param payload The token's payload
	 * @return A hash string signature
	 * @throws ResponseStatusException If the signing algorithm is invalid
	 * @throws ResponseStatusException If the secret key is not valid for signing
	 */
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
			logger.error("Invalid HMAC algorithm for token signing", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
		} catch (InvalidKeyException e) {
			logger.error("Invalid secret key spec for token signing", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
		}
	}

	/**
	 * Ensure this token string can actually be parsed as a token.
	 *
	 * @param token The auth token
	 * @throws ResponseStatusException If the token is malformed
	 */
	private void validateTokenStructure(String token) throws ResponseStatusException {
		String[] tokenParts = token.split("\\.");
		if (tokenParts.length != 3) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed token");
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

	private TokenModel parseToken(String token) throws ResponseStatusException {
		String[] tokenParts = token.split("\\.");
		byte[] header = Base64.getUrlDecoder().decode(tokenParts[0]);
		byte[] payload = Base64.getUrlDecoder().decode(tokenParts[1]);
		return TokenModel.parse(new String(header), new String(payload));
	}

	private void validateTokenExistence(TokenModel token) {
		Optional<TokenEntity> possibleTokenEntity = tokenRepository.findById(token.getTokenId());
		if (possibleTokenEntity.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token not found");
		}
	}

}
