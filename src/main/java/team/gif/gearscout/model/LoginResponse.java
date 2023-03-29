package team.gif.gearscout.model;

public record LoginResponse(
	Integer teamNumber,
	String username,
	String role
) {}
