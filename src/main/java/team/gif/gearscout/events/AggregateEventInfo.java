package team.gif.gearscout.events;

public class AggregateEventInfo {

	public final Long eventId;
	public final Integer teamNumber;
	public final Integer gameYear;
	public final String eventCode;
	public final String secretCode;
	private Long matchCount;
	private Long inspectionCount;

	AggregateEventInfo(
		Long eventId,
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		this.eventId = eventId;
		this.teamNumber = teamNumber;
		this.gameYear = gameYear;
		this.eventCode = eventCode;
		this.secretCode = secretCode;
		this.matchCount = 0L;
		this.inspectionCount = 0L;
	}

	public void setMatchCount(Long matchCount) {
		this.matchCount = matchCount;
	}

	public void setInspectionCount(Long inspectionCount) {
		this.inspectionCount = inspectionCount;
	}

	public Long getMatchCount() {
		return matchCount;
	}

	public Long getInspectionCount() {
		return inspectionCount;
	}
}
