import { Match, MatchResponse, Objective } from '../models/response.model';


class MatchModelService {

	convertMatchResponseToModel = (match: MatchResponse): Match => {
		const gamemodes: Map<String, Objective[]> = new Map();

		for (const objective of match.objectives) {
			const gamemode = objective.gamemode;

			if (!gamemodes.has(gamemode)) {
				gamemodes.set(gamemode, []);
			}

			gamemodes.get(gamemode).push(objective);
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
