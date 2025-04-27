package team.gif.gearscout.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.inspections.InspectionRepository;
import team.gif.gearscout.matches.MatchRepository;
import team.gif.gearscout.shared.EventInfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

	private static class EventMap {
		// gameYear -> eventCode -> secretCode -> EventInfo
		HashMap<Integer, HashMap<String, HashMap<String, AggregateEventInfo>>> gameYearMap = new HashMap<>();

		void putIfAbsent(
			Integer gameYear,
			String eventCode,
			String secretCode,
			AggregateEventInfo value
		) {
			gameYearMap.putIfAbsent(gameYear, new HashMap<>());
			HashMap<String, HashMap<String, AggregateEventInfo>> eventCodeMap = gameYearMap.get(gameYear);

			eventCodeMap.putIfAbsent(eventCode, new HashMap<>());
			HashMap<String, AggregateEventInfo> secretCodeMap = eventCodeMap.get(eventCode);

			secretCodeMap.putIfAbsent(secretCode, value);
		}

		AggregateEventInfo getCorrespondingAggregate(EventInfo event) {
			return get(event.gameYear(), event.eventCode(), event.secretCode());
		}

		AggregateEventInfo get(Integer gameYear, String eventCode, String secretCode) {
			HashMap<String, HashMap<String, AggregateEventInfo>> eventCodeMap = gameYearMap.get(gameYear);
			if (eventCodeMap == null) return null;

			HashMap<String, AggregateEventInfo> secretCodeMap = eventCodeMap.get(eventCode);
			if (secretCodeMap == null) return null;

			return secretCodeMap.get(secretCode);
		}

		List<AggregateEventInfo> flatten() {
			List<AggregateEventInfo> events = new ArrayList<>();
			gameYearMap.forEach((gameYear, eventMap) ->
				eventMap.forEach((eventCode, secretCodeMap) ->
					secretCodeMap.forEach((secretCode, aggregateEventInfo) ->
						events.add(aggregateEventInfo)
					)
				)
			);

			return events;
		}
	}

	public EventEntity getEvent(Integer teamNumber, Integer gameYear, String eventCode, String secretCode) {
		Optional<EventEntity> eventEntity = eventRepository.findByEventDescriptor(teamNumber, gameYear, eventCode, secretCode);
		return eventEntity.orElse(
			eventRepository.save(new EventEntity(teamNumber, gameYear, eventCode, secretCode))
		);
	}

	public List<AggregateEventInfo> getEventList(Integer teamNumber) {
		List<EventInfo> matchEvents = matchRepository.getEventListForTeam(teamNumber);
		List<EventInfo> inspectionEvents = inspectionRepository.getInspectionCountPerEvent(List.of());

		EventMap eventMap = new EventMap();
		for (EventInfo event : matchEvents) {
			eventMap.putIfAbsent(event.gameYear(), event.eventCode(), event.secretCode(), generateEmptyEvent(event));
			AggregateEventInfo aggregate = eventMap.getCorrespondingAggregate(event);
			aggregate.setMatchCount(event.matchCount());
		}

		for (EventInfo event : inspectionEvents) {
			eventMap.putIfAbsent(event.gameYear(), event.eventCode(), event.secretCode(), generateEmptyEvent(event));
			AggregateEventInfo aggregate = eventMap.getCorrespondingAggregate(event);
			aggregate.setInspectionCount(event.matchCount());
		}

		return eventMap.flatten();
	}

	private AggregateEventInfo generateEmptyEvent(EventInfo event) {
		return new AggregateEventInfo(event.eventId(), event.teamNumber(), event.gameYear(), event.eventCode(), event.secretCode());
	}

}
