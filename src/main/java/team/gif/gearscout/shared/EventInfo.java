package team.gif.gearscout.shared;

public record EventInfo(
	Long eventId,
	Integer teamNumber,
	Integer gameYear,
	String eventCode,
	String secretCode,
	Long matchCount
) {}
