package team.gif.gearscout.images;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.shared.exception.EmptyFileNotAllowedException;
import team.gif.gearscout.shared.exception.ImageTypeInvalidException;
import team.gif.gearscout.auth.LoginResponse;
import team.gif.gearscout.auth.AuthService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/v1/images", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImageController {
	
	private static final Logger logger = LogManager.getLogger(ImageController.class);
	private final AuthService authService;
	private final ImageService imageService;
	
	@Autowired
	public ImageController(
		AuthService authService,
		ImageService imageService
	) {
		this.authService = authService;
		this.imageService = imageService;
	}
	
	
	@PostMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}/robot/{robotNumber}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addImage(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode") String secretCode,
		@RequestHeader(value = "timeCreated", defaultValue = "") String timeCreated,
		@RequestHeader(value = "token") String token,
		@RequestParam(value = "image") MultipartFile image
	) throws IOException {
		logger.debug("Received addImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);
		
		LoginResponse credentials;
		try {
			credentials = authService.validateToken(token);
		} catch (JsonProcessingException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		
		if (!Objects.equals(credentials.role(), "admin")) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		
		// In the future, we will allow a user to belong to multiple teams (if not only for testing)
		if (!Objects.equals(teamNumber, credentials.teamNumber())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		
		imageService.validateImage(image);
		imageService.saveImage(
			teamNumber,
			gameYear,
			robotNumber,
			eventCode,
			secretCode,
			credentials.username(),
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
		@PathVariable String eventCode,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		logger.debug("Received getImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);
		return ResponseEntity.ok(
			imageService.getImageInfo(
				teamNumber,
				gameYear,
				robotNumber,
				eventCode,
				secretCode
			)
		);
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/event/{eventCode}")
	public ResponseEntity<List<ImageInfoEntity>> getAllImageInfoForEvent(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable String eventCode,
		@RequestHeader(value = "secretCode") String secretCode
	) {
		logger.debug("Received getAllImageInfoForEvent request");
		return ResponseEntity.ok(
			imageService.getImageInfoForEvent(
				teamNumber,
				gameYear,
				eventCode,
				secretCode
			)
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
