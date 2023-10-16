package team.gif.gearscout.auth;

public record LoginResponse(
	Integer teamNumber,
	String username,
	String role
) {}
