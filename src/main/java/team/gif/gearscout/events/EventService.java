package team.gif.gearscout.events;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import team.gif.gearscout.inspections.InspectionRepository;
import team.gif.gearscout.matches.MatchRepository;
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

	@Transactional(isolation = Isolation.SERIALIZABLE)
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

	public List<EventEntity> getSharedEvents(EventEntity eventEntity) {
		return eventRepository.findSharedEvents(
			eventEntity.getGameYear(),
			eventEntity.getEventCode(),
			eventEntity.getSecretCode()
		);
	}

	public EventEntity getEvent(Long eventId) {
		return eventRepository
			.findById(eventId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	public void setEventShared(EventEntity event, boolean shared) {
		event.setShared(shared);
		eventRepository.save(event);
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
