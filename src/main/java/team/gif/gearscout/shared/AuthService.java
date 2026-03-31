package team.gif.gearscout.shared;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.token.TokenService;
import team.gif.gearscout.token.model.TokenModel;
import team.gif.gearscout.users.UserEntity;
import team.gif.gearscout.users.UserService;

@Service
public class AuthService {

	private final TokenService tokenService;
	private final UserService userService;

	@Autowired
	public AuthService(
		TokenService tokenService,
		UserService userService
	) {
		this.tokenService = tokenService;
		this.userService = userService;
	}


	public UserEntity getUserFromTokenHeader(String tokenHeader) {
		TokenModel token = tokenService.validateTokenHeader(tokenHeader);
		Long userId = token.getUserId();
		return userService.findUserById(userId);
	}

}
