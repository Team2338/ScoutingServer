package team.gif.gearscout.images;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.token.UserEntity;
import team.gif.gearscout.token.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v2/images", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImageControllerV2 {

	private static final Logger logger = LogManager.getLogger(ImageControllerV2.class);
	private final ImageService imageService;
	private final TokenService tokenService;
	private final UserService userService;

	@Autowired
	public ImageControllerV2(
		ImageService imageService,
		TokenService tokenService,
		UserService userService
	) {
		this.imageService = imageService;
		this.tokenService = tokenService;
		this.userService = userService;
	}


	@PostMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/robot/{robotNumber}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addImage(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode") String secretCode,
		@RequestHeader(value = "timeCreated", defaultValue = "") String timeCreated,
		@RequestHeader(value = "Authorization") String token,
		@RequestParam(value = "image") MultipartFile image
	) throws IOException {
		logger.debug("Received addImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);

		if (token.startsWith("bearer")) {
			token = token.replace("bearer ", "");
		}
		Long userId = tokenService.validateToken(token);
		UserEntity user = userService.findUserById(userId);

		List<String> allowedRoles = List.of("OWNER", "ADMIN");
		if (!allowedRoles.contains(user.getRole())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		// In the future, we will allow a user to belong to multiple teams (if not only for testing)
		if (!Objects.equals(teamNumber, user.getTeamNumber())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		imageService.validateImage(image);
		imageService.saveImage(
			teamNumber,
			gameYear,
			robotNumber,
			eventCode,
			secretCode,
			user.getUsername(),
			timeCreated,
			image.getBytes(),
			image.getContentType()
		);
		return ResponseEntity.ok().build();
	}

}
