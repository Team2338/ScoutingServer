package team.gif.gearscout.token;

public record LoginResponse(
	String token,
	UserEntity user
) {}
