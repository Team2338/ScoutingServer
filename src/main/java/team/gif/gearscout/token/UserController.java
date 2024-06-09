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

@RestController
@RequestMapping(value = "/api/v2/user", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

	private static final Logger logger = LogManager.getLogger(LoginControllerV2.class);
	private final CredentialServiceV2 credentialService;
	private final TokenService tokenService;
	private final UserService userService;

	@Autowired
	public UserController(
		CredentialServiceV2 credentialService,
		TokenService tokenService,
		UserService userService
	) {
		this.credentialService = credentialService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
	ResponseEntity<LoginResponse> createUser(@RequestBody @Valid UserCreateRequest request) {
		logger.debug("Received createUser request");

		UserEntity user = userService.createUser(request);
		credentialService.saveCredentials(user.getUserId(), request.password());
		String token = tokenService.generateAndSaveToken(user.getUserId(), user.getRole(), user.getTeamNumber());
		LoginResponse response = new LoginResponse(token, user);

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

}
