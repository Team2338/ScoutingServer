package team.gif.gearscout.events;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import team.gif.gearscout.inspections.InspectionRepository;
import team.gif.gearscout.matches.MatchRepository;
import team.gif.gearscout.matches.model.MatchEntity;
import team.gif.gearscout.shared.EventInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
		EventRepository eventRepository
	) {
		this.matchRepository = matchRepository;
		this.inspectionRepository = inspectionRepository;
		this.eventRepository = eventRepository;
	}

	public EventEntity getOrCreateEvent(Integer teamNumber, Integer gameYear, String eventCode, String secretCode) {
		Optional<EventEntity> eventEntity = eventRepository.findByEventDescriptor(teamNumber, gameYear, eventCode, secretCode);

		if (eventEntity.isPresent()) {
			return eventEntity.get();
		}

		try {
			return eventRepository.save(new EventEntity(teamNumber, gameYear, eventCode, secretCode));
		} catch (DataIntegrityViolationException | ConstraintViolationException ex) {
			ConstraintViolationException constraintViolation = ex instanceof ConstraintViolationException
				? (ConstraintViolationException) ex
				: (ConstraintViolationException) ex.getCause();

			/* If this failed due to a race condition with another call to this function
			 * (ie we checked for the event and didn't find it, then another thread creates it before we try to)
			 * then try searching for the event again
			 */
			if (Objects.equals(constraintViolation.getConstraintName(), "uk__events__descriptor")) {
				return eventRepository.findByEventDescriptor(teamNumber, gameYear, eventCode, secretCode)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot get or create event"));
			}

			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, null, ex);
		}
	}

	public EventEntity getEvent(Long eventId) {
		return eventRepository
			.findById(eventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	public EventEntity setEventHiddenStatus(Long eventId, boolean isHidden) {
		EventEntity event = eventRepository
			.findById(eventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

		event.setIsHidden(isHidden);
		event = eventRepository.save(event);

		return event;
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
					event.getSecretCode(),
					event.getIsHidden()
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

	public AggregateEventInfo migrateEvent(Long fromEventId, Long toEventId) {
		EventEntity fromEvent = eventRepository.findById(fromEventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find event " + fromEventId));
		EventEntity toEvent = eventRepository.findById(toEventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find event " + toEventId));


		matchRepository.migrateEvent(fromEventId, toEventId);

		// TODO: call inspection repository to migrate
		// TODO: call notes repository to migrate
		// TODO: call images repository to migrate

		// TODO: delete 'fromEvent'

		List<EventInfo> matchCounts = matchRepository.getMatchCountPerEvent(List.of(toEventId));
		List<EventInfo> inspectionCounts = inspectionRepository.getInspectionCountPerEvent(List.of(toEventId));

		if (matchCounts.isEmpty() || inspectionCounts.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve updated event data");
		}

		AggregateEventInfo result = new AggregateEventInfo(
			toEvent.getId(),
			toEvent.getTeamNumber(),
			toEvent.getGameYear(),
			toEvent.getEventCode(),
			toEvent.getSecretCode(),
			toEvent.getIsHidden()
		);
		result.setMatchCount(matchCounts.getFirst().matchCount());
		result.setInspectionCount(inspectionCounts.getFirst().matchCount());

		return result;
	}

}
