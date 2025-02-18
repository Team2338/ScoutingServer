package team.gif.gearscout.users;

import jakarta.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.token.CredentialServiceV2;
import team.gif.gearscout.token.LoginResponse;
import team.gif.gearscout.token.TokenModel;
import team.gif.gearscout.token.TokenService;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v2/user", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

	private static final Logger logger = LogManager.getLogger(UserController.class);
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


	@GetMapping(value = "")
	ResponseEntity<List<UserEntity>> getUsersForTeam(
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received getUsersForTeam request");

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		List<String> allowedRoles = List.of(UserRoles.VERIFIED_USER, UserRoles.ADMIN, UserRoles.SUPERADMIN);
		if (!allowedRoles.contains(user.getRole())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		List<UserEntity> users = userService.findUsersByTeamNumber(user.getTeamNumber());
		return ResponseEntity.ok(users);
	}


	@PutMapping(value = "/{userId}/role/{role}")
	ResponseEntity<UserEntity> updateUserRole(
		@PathVariable Long userId,
		@PathVariable String role,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received updateUserRole request");

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long requesterId = token.getUserId();
		UserEntity requester = userService.findUserById(requesterId);
		UserEntity target = userService.findUserById(userId);

		if (target.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		List<String> allowedRoles = List.of(UserRoles.ADMIN, UserRoles.SUPERADMIN);
		if (!allowedRoles.contains(requester.getRole())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		if (!requester.getTeamNumber().equals(target.getTeamNumber()) && !requester.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		if (!UserRoles.ALL.contains(role)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown role: " + role);
		}

		UserEntity updatedUser = userService.updateUserRole(userId, role);
		return ResponseEntity.ok(updatedUser);
	}

}
