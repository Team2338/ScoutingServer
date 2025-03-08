package team.gif.gearscout.tba;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TbaService {
	private final TbaClient tbaClient;

	@Autowired
	public TbaService(@Value("${tba.key}") String tbaApiKey) {
		this.tbaClient = new TbaClient(tbaApiKey);
	}

	public boolean checkOnline() {
		return tbaClient.isOk();
	}

	public List<MatchScheduleEntry> getMatchSchedule(String eventCode, int year, int start, int end) {
		String tbaEventId = tbaEventIdFromParts(eventCode, year);
		ArrayList<MatchScheduleEntry> schedule = tbaClient.getMatchSchedule(tbaEventId);

		if (schedule == null) {
			return new ArrayList<>();
		}

		return schedule.stream()
			.filter(m -> m.getMatchNumber() >= start && m.getMatchNumber() <= end)
			.sorted()
			.collect(Collectors.toList());
	}

	public List<MatchScheduleEntry> getMatchSchedule(String eventCode, int year) {
		return getMatchSchedule(eventCode, year, 1, 9999);
	}

	public List<MatchScheduleEntry> getMatchesForTeam(String eventCode, int year, int team) {
		String tbaEventId = tbaEventIdFromParts(eventCode, year);
		ArrayList<MatchScheduleEntry> schedule = tbaClient.getMatchSchedule(tbaEventId);

		if (schedule == null) {
			return new ArrayList<>();
		}

		return schedule.stream()
			.filter(m -> (m.getRed1() == team || m.getRed2() == team || m.getRed3() == team
				|| m.getBlue1() == team || m.getBlue2() == team || m.getBlue3() == team))
			.sorted()
			.collect(Collectors.toList());
	}

	private static String tbaEventIdFromParts(String eventCode, int year) {
		String eventSlug = eventCode.split("-")[0].toLowerCase();
		return year + eventSlug;
	}
}
