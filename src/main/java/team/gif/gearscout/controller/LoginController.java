package team.gif.gearscout.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.gif.gearscout.model.LoginRequest;
import team.gif.gearscout.model.LoginResponse;
import team.gif.gearscout.service.AuthService;

@RestController
@RequestMapping(value = "/api/v1/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class LoginController {
	
	private static final Logger logger = LogManager.getLogger(LoginController.class);
	private final AuthService authService;
	
	@Autowired
	public LoginController(AuthService authService) {
		this.authService = authService;
	}
	
	
	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<LoginResponse> login(
		@RequestBody LoginRequest request
	) {
		logger.debug("Received login request: {}, {} ", request.teamNumber(), request.username());
		LoginResponse response = authService.getRole(request.teamNumber(), request.username());
		
		return ResponseEntity.ok(response);
	}
	
}
