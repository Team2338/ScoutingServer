package team.gif.gearscout.matches.controller;

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
import team.gif.gearscout.events.EventEntity;
import team.gif.gearscout.events.EventService;
import team.gif.gearscout.matches.model.MatchEntity;
import team.gif.gearscout.matches.MatchService;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.token.model.TokenModel;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v2", produces = MediaType.APPLICATION_JSON_VALUE)
public class MemberMatchController extends GuestMatchController {

	private static final Logger logger = LogManager.getLogger(MemberMatchController.class);
	private final EventService eventService;
	private final MatchService matchService;
	private final TokenService tokenService;
	private final UserService userService;


	@Autowired
	public MemberMatchController(
		EventService eventService,
		MatchService matchService,
		TokenService tokenService,
		UserService userService
	) {
		super(matchService, eventService);
		this.eventService = eventService;
		this.matchService = matchService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@PutMapping(value = "/match/{matchId}/hide")
	public ResponseEntity<MatchEntity> hideMatch(
		@PathVariable Long matchId,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received hideMatch request: {}", matchId);

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);


		MatchEntity result = switch (user.getRole()) {
			case UserRoles.SUPERADMIN -> matchService.setMatchHiddenStatus(matchId, true);
			case UserRoles.ADMIN -> {
				MatchEntity match = matchService.getMatch(matchId);
				EventEntity event = eventService.getEvent(match.getEventId());
				if (!Objects.equals(event.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}
				yield matchService.setMatchHiddenStatus(matchId, true);
			}
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}


	@PutMapping(value = "/match/{matchId}/unhide")
	public ResponseEntity<MatchEntity> unhideMatch(
		@PathVariable Long matchId,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received unhideMatch request: {}", matchId);

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		MatchEntity result = switch (user.getRole()) {
			case UserRoles.SUPERADMIN -> matchService.setMatchHiddenStatus(matchId, false);
			case UserRoles.ADMIN -> {
				MatchEntity match = matchService.getMatch(matchId);
				EventEntity event = eventService.getEvent(match.getEventId());
				if (!Objects.equals(event.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}
				yield matchService.setMatchHiddenStatus(matchId, false);
			}
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}

}
