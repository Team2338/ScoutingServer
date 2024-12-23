package team.gif.gearscout.shared;

public record EventInfo(
	Integer teamNumber,
	Integer gameYear,
	String eventCode,
	String secretCode,
	Long matchCount
) {}
