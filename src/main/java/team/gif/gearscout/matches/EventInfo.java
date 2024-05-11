package team.gif.gearscout.matches;

public record EventInfo(
	Integer teamNumber,
	Integer gameYear,
	String eventCode,
	String secretCode,
	Long matchCount
) {}
