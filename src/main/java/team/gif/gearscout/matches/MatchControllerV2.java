package team.gif.gearscout.matches;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.token.UserEntity;
import team.gif.gearscout.token.UserService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v2", produces = MediaType.APPLICATION_JSON_VALUE)
public class MatchControllerV2 extends MatchController {

	private static final Logger logger = LogManager.getLogger(MatchControllerV2.class);
	private final MatchService matchService;
	private final TokenService tokenService;
	private final UserService userService;


	@Autowired
	public MatchControllerV2(
		MatchService matchService,
		TokenService tokenService,
		UserService userService
	) {
		super(matchService);
		this.matchService = matchService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@PutMapping(value = "/match/{matchId}/hide")
	public ResponseEntity<MatchEntity> hideMatch(
		@PathVariable Long matchId,
		@RequestHeader(value = "Authorization") String token
	) {
		logger.debug("Received hideMatch request: {}", matchId);

		if (token.startsWith("bearer")) {
			token = token.replace("bearer ", "");
		}
		Long userId = tokenService.validateToken(token);
		UserEntity user = userService.findUserById(userId);

		MatchEntity result = switch (user.getRole()) {
			case "ADMIN" -> matchService.setMatchHiddenStatus(user.getTeamNumber(), matchId, true);
			case "SUPERADMIN" -> matchService.setMatchHiddenStatus(matchId, true);
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}


	@PutMapping(value = "/match/{matchId}/unhide")
	public ResponseEntity<MatchEntity> unhideMatch(
		@PathVariable Long matchId,
		@RequestHeader(value = "Authorization") String token
	) {
		logger.debug("Received unhideMatch request: {}", matchId);

		if (token.startsWith("bearer")) {
			token = token.replace("bearer ", "");
		}
		Long userId = tokenService.validateToken(token);
		UserEntity user = userService.findUserById(userId);

		MatchEntity result = switch (user.getRole()) {
			case "ADMIN" -> matchService.setMatchHiddenStatus(user.getTeamNumber(), matchId, false);
			case "SUPERADMIN" -> matchService.setMatchHiddenStatus(matchId, false);
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}

}
