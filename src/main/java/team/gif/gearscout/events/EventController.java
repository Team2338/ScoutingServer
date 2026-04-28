package team.gif.gearscout.events;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.shared.AuthService;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.token.model.TokenModel;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v1/events", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventController {

	private static final Logger logger = LogManager.getLogger(EventController.class);
	private final AuthService authService;
	private final EventService eventService;
	private final TokenService tokenService;
	private final UserService userService;


	@Autowired
	public EventController(
		AuthService authService,
		EventService eventService,
		TokenService tokenService,
		UserService userService
	) {
		this.authService = authService;
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


	@GetMapping(value = "/{teamNumber}")
	public ResponseEntity<List<AggregateEventInfo>> getEvents(
		@PathVariable Integer teamNumber,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received getEvents request");

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		if (!user.getRole().equals(UserRoles.ADMIN) && !user.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		// Only a superadmin can get events for other teams
		if (!teamNumber.equals(user.getTeamNumber()) && !user.getRole().equals(UserRoles.SUPERADMIN)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		List<AggregateEventInfo> events = eventService.getEventList(teamNumber);
		return ResponseEntity.ok(events);
	}


	@PutMapping(value = "/{eventId}/hide")
	public ResponseEntity<EventEntity> hideEvent(
		@PathVariable Long eventId,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received hideEvent request");

		UserEntity user = authService.getUserFromTokenHeader(tokenHeader);

		EventEntity result = switch (user.getRole()) {
			case UserRoles.SUPERADMIN -> eventService.setEventHiddenStatus(eventId, true);
			case UserRoles.ADMIN -> {
				EventEntity event = eventService.getEvent(eventId);
				if (!Objects.equals(event.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}
				yield eventService.setEventHiddenStatus(eventId, true);
			}
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}


	@PutMapping(value = "/{eventId}/unhide")
	public ResponseEntity<EventEntity> unhideEvent(
		@PathVariable Long eventId,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received unhideEvent request");

		UserEntity user = authService.getUserFromTokenHeader(tokenHeader);

		EventEntity result = switch (user.getRole()) {
			case UserRoles.SUPERADMIN -> eventService.setEventHiddenStatus(eventId, false);
			case UserRoles.ADMIN -> {
				EventEntity event = eventService.getEvent(eventId);
				if (!Objects.equals(event.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}
				yield eventService.setEventHiddenStatus(eventId, false);
			}
			default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		};

		return ResponseEntity.ok(result);
	}


	@PutMapping(value = "/{fromEventId}/migrateTo/{toEventId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AggregateEventInfo> migrateEvent(
		@PathVariable Long fromEventId,
		@PathVariable Long toEventId,
		@RequestHeader(value = "Authorization") String tokenHeader
	) {
		logger.debug("Received migrateEvent request");

		UserEntity user = authService.getUserFromTokenHeader(tokenHeader);

		if (fromEventId.equals(toEventId)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "fromEventId and toEventId must not match");
		}

		switch (user.getRole()) {
			case UserRoles.SUPERADMIN:
				break;
			case UserRoles.ADMIN:
				EventEntity fromEvent = eventService.getEvent(fromEventId);
				if (!Objects.equals(fromEvent.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}

				EventEntity toEvent = eventService.getEvent(toEventId);
				if (!Objects.equals(toEvent.getTeamNumber(), user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}

				break;
			default:
				throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		AggregateEventInfo result = eventService.migrateEvent(fromEventId, toEventId);

		return ResponseEntity.ok(result);
	}

}
