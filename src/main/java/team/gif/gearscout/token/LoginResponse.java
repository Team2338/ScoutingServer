package team.gif.gearscout.token;

import team.gif.gearscout.users.UserEntity;

public record LoginResponse(
	String token,
	UserEntity user
) {}
