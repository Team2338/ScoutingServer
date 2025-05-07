import { Match, MatchResponse, Objective } from '../models';

class MatchModelService {

	convertMatchResponsesToModels = (matches: MatchResponse[]): Match[] => {
		return matches.map(this.convertMatchResponseToModel);
	};

	convertMatchResponseToModel = (match: MatchResponse): Match => {
		const gamemodes: Map<string, Objective[]> = new Map();

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
			matchNumber: match.matchNumber,
			robotNumber: match.robotNumber,
			creator: match.creator,
			timeCreated: match.timeCreated,
			isHidden: match.isHidden,
			gamemodes: gamemodes
		};
	};

}

const service = new MatchModelService();
export default service;
