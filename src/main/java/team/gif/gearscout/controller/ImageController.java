package team.gif.gearscout.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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
import team.gif.gearscout.exception.EmptyFileNotAllowedException;
import team.gif.gearscout.exception.ImageTypeInvalidException;
import team.gif.gearscout.model.ImageInfoEntity;
import team.gif.gearscout.service.ImageService;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/v1/images", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImageController {
	
	private static final Logger logger = LogManager.getLogger(ImageController.class);
	private final ImageService imageService;
	
	@Autowired
	public ImageController(ImageService imageService) {
		this.imageService = imageService;
	}
	
	
	@PostMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/robot/{robotNumber}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> addImage(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode,
		@RequestHeader(value = "creator", defaultValue = "") String creator,
		@RequestHeader(value = "timeCreated", defaultValue = "") String timeCreated,
		@RequestParam(value = "image") MultipartFile image
	) throws IOException {
		logger.debug("Received addImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);
		
		imageService.saveImage(
			teamNumber,
			gameYear,
			robotNumber,
			secretCode,
			creator,
			timeCreated,
			image.getBytes()
		);
		return ResponseEntity.ok().build();
	}
	
	
	@GetMapping(value = "/team/{teamNumber}/gameYear/{gameYear}/robot/{robotNumber}")
	public ResponseEntity<ImageInfoEntity> getImageInfo(
		@PathVariable Integer teamNumber,
		@PathVariable Integer gameYear,
		@PathVariable Integer robotNumber,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		logger.debug("Received getImage request: {}, {}, {}", teamNumber, gameYear, robotNumber);
		return ResponseEntity.ok(imageService.getImageInfo(teamNumber, gameYear, robotNumber, secretCode));
	}
	
	
	@GetMapping(value = "images/{id}")
	public ResponseEntity<byte[]> getImage(
		@PathVariable Long id,
		@RequestHeader(value = "secretCode", defaultValue = "") String secretCode
	) {
		return ResponseEntity.of(imageService.getImageContent(id, secretCode));
	}
	
	
	@ExceptionHandler(value = { EmptyFileNotAllowedException.class, ImageTypeInvalidException.class })
	public ResponseEntity<Void> handleBadFileUpload(Exception e) {
		return ResponseEntity.badRequest().build();
	}
	
}
