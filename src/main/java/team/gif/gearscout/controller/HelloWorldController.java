package team.gif.gearscout.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1", produces = MediaType.TEXT_PLAIN_VALUE)
public class HelloWorldController {
	
	private static final Logger logger = LogManager.getLogger(HelloWorldController.class);
	
	@GetMapping(value = "/hello")
	public ResponseEntity<String> hello() {
		logger.debug("Received HelloWorld request");
		return ResponseEntity.ok("Hello world");
	}
	
}
