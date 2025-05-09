package team.gif.gearscout.images;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.events.EventService;
import team.gif.gearscout.images.model.ImageContentEntity;
import team.gif.gearscout.images.model.ImageInfoEntity;
import team.gif.gearscout.shared.UserRoles;
import team.gif.gearscout.shared.exception.EmptyFileNotAllowedException;
import team.gif.gearscout.shared.exception.ImageTypeInvalidException;
import team.gif.gearscout.shared.validation.EventCodeConstraint;
import team.gif.gearscout.shared.validation.SecretCodeConstraint;
import team.gif.gearscout.token.model.TokenModel;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/v2/images", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImageControllerV2 {

	private static final Logger logger = LogManager.getLogger(ImageControllerV2.class);
	private final ImageService imageService;
	private final TokenService tokenService;
	private final UserService userService;
	private final EventService eventService;

	@Autowired
	public ImageControllerV2(
		ImageService imageService,
		TokenService tokenService,
		UserService userService,
		EventService eventService
	) {
		this.imageService = imageService;
		this.tokenService = tokenService;
		this.userService = userService;
		this.eventService = eventService;
	}


	@PostMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/robot/{robotNumber}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addImage(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode,
		@RequestHeader(value = "timeCreated", defaultValue = "") String timeCreated,
		@RequestHeader(value = "Authorization") String tokenHeader,
		@RequestParam(value = "image") MultipartFile image
	) throws IOException {
		logger.debug("Received addImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);

		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		UserEntity user = userService.findUserById(userId);

		switch (user.getRole()) {
			case UserRoles.SUPERADMIN:
				// Allow
				break;
			case UserRoles.ADMIN:
				if (!Objects.equals(teamNumber, user.getTeamNumber())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN);
				}
				break;
			default:
				throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		imageService.validateImage(image);
		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		imageService.saveImage(
			eventId,
			teamNumber,
			gameYear,
			robotNumber,
			user.getUsername(),
			timeCreated,
			image.getBytes(),
			image.getContentType()
		);
		return ResponseEntity.ok().build();
	}


	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/robot/{robotNumber}")
	public ResponseEntity<ImageInfoEntity> getImageInfo(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);
		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		return ResponseEntity.ok(
			imageService.getImageInfo(eventId, robotNumber)
		);
	}


	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<ImageInfoEntity>> getAllImageInfoForEvent(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable @EventCodeConstraint String eventCode,
		@RequestHeader(value = "secretCode") @SecretCodeConstraint String secretCode
	) {
		logger.debug("Received getAllImageInfoForEvent request");
		Long eventId = eventService
			.getOrCreateEvent(teamNumber, gameYear, eventCode, secretCode)
			.getId();
		return ResponseEntity.ok(
			imageService.getImageInfoForEvent(eventId)
		);
	}


	@GetMapping(value = "/{id}")
	public ResponseEntity<byte[]> getImage(
		@PathVariable UUID id,
		@RequestHeader(value = "If-None-Match", defaultValue = "") String oldChecksum
	) {
		ImageContentEntity image = imageService
			.getImageContent(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

		String checksum = "\"%s\"".formatted(imageService.getChecksum(image));

		if (Objects.equals(oldChecksum, checksum)) {
			return ResponseEntity
				.status(HttpStatus.NOT_MODIFIED)
				.body(null);
		}

		return ResponseEntity
			.ok()
			.header("Content-Type", image.getContentType())
			.header("Cache-Control", "private, no-cache, max-age=0")
			.header("ETag", checksum)
			.header("vary", "secretCode")
			.body(image.getContent());
	}


	@ExceptionHandler(value = { EmptyFileNotAllowedException.class, ImageTypeInvalidException.class })
	public ResponseEntity<Void> handleBadFileUpload(Exception e) {
		return ResponseEntity.badRequest().build();
	}

}
