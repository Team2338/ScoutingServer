package team.gif.gearscout.token;

import jakarta.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

@RestController
@RequestMapping(value = "/api/v2/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class LoginControllerV2 {

	private static final Logger logger = LogManager.getLogger(LoginControllerV2.class);
	private final CredentialServiceV2 credentialService;
	private final TokenService tokenService;
	private final UserService userService;

	@Autowired
	public LoginControllerV2(
		CredentialServiceV2 credentialService,
		TokenService tokenService,
		UserService userService
	) {
		this.credentialService = credentialService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequestV2 request) {
		logger.debug("Received login v2 request");

		// Authenticate
		UserEntity user = userService.findUserByEmail(request.email());
		boolean credentialsMatch = credentialService.checkIfCredentialsMatch(user.getUserId(), request.password());

		if (!credentialsMatch) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}

		String token = tokenService.generateAndSaveToken(user.getUserId(), user.getRole(), user.getTeamNumber());
		LoginResponse response = new LoginResponse(token, user);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

}
