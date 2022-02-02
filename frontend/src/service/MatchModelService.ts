import { Match, MatchResponse } from '../models/response.model';


class MatchModelService {

	convertMatchResponseToModel = (match: MatchResponse): Match => {
		const gamemodes: Map<String, Map<string, number>> = new Map();

		for (const { gamemode, objective, count } of match.objectives) {
			if (!gamemodes.has(gamemode)) {
				gamemodes.set(gamemode, new Map());
			}

			gamemodes.get(gamemode).set(objective, count);
		}

		return {
			id: match.id,
			teamNumber: match.teamNumber,
			eventCode: match.eventCode,
			matchNumber: match.matchNumber,
			robotNumber: match.robotNumber,
			creator: match.creator,
			timeCreated: match.timeCreated,
			isHidden: match.isHidden,
			gamemodes: gamemodes
		};
	}

}

export default new MatchModelService();
