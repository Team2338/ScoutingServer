package team.gif.gearscout.events;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.token.TokenModel;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

}
