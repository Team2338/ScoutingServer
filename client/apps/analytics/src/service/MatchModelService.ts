import { GAMEMODE_ORDERING, Match, MatchResponse, Objective } from '../models';

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

		this.sortObjectives(gamemodes);

		return {
			id: match.id,
			teamNumber: match.teamNumber,
			matchNumber: match.matchNumber,
			robotNumber: match.robotNumber,
			creator: match.creator,
			timeCreated: match.timeCreated,
			isHidden: match.isHidden,
			gamemodes: this.getSortedGamemodes(gamemodes)
		};
	};

	private sortObjectives(gamemodes: Map<string, Objective[]>) {
		gamemodes.forEach((objectives: Objective[]) => {
			objectives.sort((a: Objective, b: Objective) => a.objective.localeCompare(b.objective));
		});
	}

	private getSortedGamemodes(gamemodes: Map<string, Objective[]>): Map<string, Objective[]> {
		const sortedKeys: string[] = Array.from(gamemodes.keys())
			.toSorted((a: string, b: string) => (GAMEMODE_ORDERING[a] ?? a).localeCompare(GAMEMODE_ORDERING[b] ?? b));

		const result: Map<string, Objective[]> = new Map();
		for (const gamemode of sortedKeys) {
			result.set(gamemode, gamemodes.get(gamemode));
		}

		return result;
	};

}

const service = new MatchModelService();
export default service;
