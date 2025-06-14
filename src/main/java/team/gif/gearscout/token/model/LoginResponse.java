package team.gif.gearscout.token.model;

import team.gif.gearscout.users.UserEntity;

public record LoginResponse(
	String token,
	UserEntity user
) {}
