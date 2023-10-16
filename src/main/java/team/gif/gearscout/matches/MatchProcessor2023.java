package team.gif.gearscout.matches;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

@Service
public class MatchProcessor2023 {
	
	private static final Logger logger = LogManager.getLogger(MatchProcessor2023.class);
	
	public void process(NewMatch match) {
		String color = match.getAllianceColor().toUpperCase();
		List<ObjectiveEntity> objectives = match.getObjectives()
			.stream()
			.mapMulti((ObjectiveEntity objective, Consumer<ObjectiveEntity> consumer) -> {
				if (objective.getObjective().equals("GRID_2023")) {
					handleGridObjective(objective, consumer, color);
					return;
				}
				
				consumer.accept(objective);
			})
			.toList();
		
		match.setObjectives(objectives);
	}
	
	private void handleGridObjective(ObjectiveEntity objective, Consumer<ObjectiveEntity> consumer, String allianceColor) {
		objective.setObjective(allianceColor + "_GRID_2023");
		consumer.accept(objective);
		
		
		// We consider the blue side to be "normal"
		ObjectiveEntity normalized = new ObjectiveEntity();
		Integer[] scoreList = Arrays.copyOf(objective.getList(), 27);
		normalized.setObjective("NORMALIZED_GRID_2023");
		normalized.setGamemode(objective.getGamemode());
		normalized.setMatch(objective.getMatch());
		normalized.setCount(objective.getCount());
		normalized.setList(scoreList);
		
		// Red-side grid is mirrored, so flip it to match blue side
		if (allianceColor.equals("RED")) {
			// [8, 7, 6, 5, 4, 3, 2, 1, 0, 17, 16, 15, 14, 13, 12, 11, 10, 9, 26, 25, 24, 23, 22, 21, 20, 19, 18]
			Integer[] normalizedScoreList = {
				scoreList[8], scoreList[7], scoreList[6],   scoreList[5], scoreList[4], scoreList[3],   scoreList[2], scoreList[1], scoreList[0],
				scoreList[17], scoreList[16], scoreList[15],   scoreList[14], scoreList[13], scoreList[12],   scoreList[11], scoreList[10], scoreList[9],
				scoreList[26], scoreList[25], scoreList[24],   scoreList[23], scoreList[22], scoreList[21],   scoreList[20], scoreList[19], scoreList[18],
			};
			normalized.setList(normalizedScoreList);
		}
		consumer.accept(normalized);
	}
}
