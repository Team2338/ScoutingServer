package team.gif.gearscout.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.inspections.InspectionRepository;
import team.gif.gearscout.matches.MatchRepository;
import team.gif.gearscout.shared.EventInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventService {

	private final MatchRepository matchRepository;
	private final InspectionRepository inspectionRepository;
	private final EventRepository eventRepository;

	@Autowired
	public EventService(
		MatchRepository matchRepository,
		InspectionRepository inspectionRepository,
		EventRepository eventRepository) {
		this.matchRepository = matchRepository;
		this.inspectionRepository = inspectionRepository;
		this.eventRepository = eventRepository;
	}

	public EventEntity getOrCreateEvent(Integer teamNumber, Integer gameYear, String eventCode, String secretCode) {
		Optional<EventEntity> eventEntity = eventRepository.findByEventDescriptor(teamNumber, gameYear, eventCode, secretCode);
		return eventEntity.orElseGet(
			() -> eventRepository.save(new EventEntity(teamNumber, gameYear, eventCode, secretCode))
		);
	}

	public EventEntity getEvent(Long eventId) {
		return eventRepository
			.findById(eventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	public List<AggregateEventInfo> getEventList(Integer teamNumber) {
		List<EventEntity> events = eventRepository.getEventEntitiesByTeamNumber(teamNumber);
		List<Long> eventIds = events.stream()
			.map(EventEntity::getId)
			.toList();

		List<EventInfo> matchCounts = matchRepository.getMatchCountPerEvent(eventIds);
		Map<Long, Long> matchCountMap = convertCountsToMap(matchCounts);

		List<EventInfo> inspectionCounts = inspectionRepository.getInspectionCountPerEvent(eventIds);
		Map<Long, Long> inspectionCountMap = convertCountsToMap(inspectionCounts);

		return events.stream()
			.map(event -> {
				AggregateEventInfo info = new AggregateEventInfo(
					event.getId(),
					event.getTeamNumber(),
					event.getGameYear(),
					event.getEventCode(),
					event.getSecretCode()
				);
				info.setMatchCount(matchCountMap.getOrDefault(event.getId(), 0L));
				info.setInspectionCount(inspectionCountMap.getOrDefault(event.getId(), 0L));

				return info;
			})
			.toList();
	}

	private Map<Long, Long> convertCountsToMap(List<EventInfo> counts) {
		Map<Long, Long> map = new HashMap<>();
		for (EventInfo event : counts) {
			map.put(event.eventId(), event.matchCount());
		}

		return map;
	}

}
