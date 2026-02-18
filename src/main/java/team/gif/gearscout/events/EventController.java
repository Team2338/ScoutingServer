package team.gif.gearscout.events;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.GameYearConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.token.model.TokenModel;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/events", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventController {

	private static final Logger logger = LogManager.getLogger(EventController.class);
	private final EventService eventService;
	private final TokenService tokenService;
	private final UserService userService;


	@Autowired
	public EventController(
		EventService eventService,
		TokenService tokenService,
		UserService userService
	) {
		this.eventService = eventService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@GetMapping(value = "")
	public ResponseEntity<List<AggregateEventInfo>> getEvents(
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received getEvents request");

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		if (!user.getRole().equals(UserRoles.ADMIN) && !user.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		List<AggregateEventInfo> events = eventService.getEventList(user.getTeamNumber());
		return ResponseEntity.ok(events);
	}

	@PostMapping(value = "/gameYear/{gameYear}/event/{eventCode}/share")
	public ResponseEntity<Void> shareEvent(
		@RequestHeader(value = "Authorization") String tokenHeader,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
		@PathVariable @GameYearConstraint Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@RequestBody @Valid boolean shared
	) {
		logger.debug("Received shareEvent request for eventCode: {}", eventCode);

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		if (!user.getRole().equals(UserRoles.ADMIN) && !user.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		EventEntity event = eventService.getOrCreateEvent(
			user.getTeamNumber(),
			gameYear,
			eventCode,
			secretCode
		);

		eventService.setEventShared(event, shared);

		return ResponseEntity.ok().build();
	}
}
