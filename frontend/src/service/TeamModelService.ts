import { MatchResponse, Objective, ObjectiveStats, Team, TeamObjectiveStats } from '../models/response.model';
import { getMean, getMedian, getMode } from './Stats';

class TeamModelService {

	createTeam = (matches: MatchResponse[]): Team => {
		const teamNumber = matches[0].robotNumber;
		const reducedMatches = this.mergeDuplicateMatches(matches); // Merge duplicates
		const stats = this.getStats(teamNumber, reducedMatches);

		return {
			id: teamNumber,
			stats: stats
		}
	};

	/**
	 * Returns a list of matches with all duplicates merged.
	 * A duplicate matches are any set of matches whose match numbers are equal.
	 *
	 * @param matches The list of matches, which may contain duplicates.
	 */
	private mergeDuplicateMatches = (matches: MatchResponse[]): MatchResponse[] => {
		const mappedMatches = new Map<number, MatchResponse[]>();
		for (const match of matches) {
			if (!mappedMatches.has(match.matchNumber)) {
				mappedMatches.set(match.matchNumber, []);
			}

			mappedMatches.get(match.matchNumber).push(match);
		}

		// For all matches, de-dupe and add to list
		const deDupedMatches: MatchResponse[] = [];
		mappedMatches.forEach((duplicateList: MatchResponse[]) => {
			if (duplicateList.length === 1) {
				deDupedMatches.push(duplicateList[0]);
				return;
			}

			const deDuped: MatchResponse = this.mergeMatches(duplicateList);
			deDupedMatches.push(deDuped);
		});

		return deDupedMatches;
	};

	/**
	 * Returns an averaged match.
	 *
	 * Matches are merged such that each objective count is the average of all counts
	 * for that objective.
	 *
	 * If a match does not contain a certain objective that is present in other matches,
	 * the missing objective is simply not counted. It does NOT default to a 0 count.
	 *
	 * @param matches The list of matches to merge.
	 */
	private mergeMatches = (matches: MatchResponse[]): MatchResponse => {
		const objectives = new Map<string, any>();

		// Get sum of all objectives
		for (const match of matches) {
			for (const objective of match.objectives) {
				const key = objective.gamemode + objective.objective;

				if (!objectives.has(key)) {
					objectives.set(key, {
						gamemode: objective.gamemode,
						objective: objective.objective,
						count: objective.count,
						numMatchesToAverage: 1
					});

					continue;
				}

				const value = objectives.get(key);
				value.count += objective.count;
				value.numMatchesToAverage++;
			}
		}

		// Convert back into a list of objectives
		const mergedObjectives: Objective[] = [];
		objectives.forEach((value: any) => {
			value.count = (value.count / value.numMatchesToAverage);
			mergedObjectives.push(value);
		});

		return {
			...matches[0],
			objectives: mergedObjectives
		};
	};

	private getStats = (teamNumber: number, matches: MatchResponse[]): ObjectiveStats => {
		const scores = new Map<string, any>();

		// Collect a list of counts for each objective
		for (const match of matches) {
			for (const objective of match.objectives) {
				const key = objective.gamemode + objective.objective;

				if (!scores.has(key)) {
					scores.set(key, {
						gamemode: objective.gamemode,
						objective: objective.objective,
						scores: []
					});
				}

				scores.get(key).scores.push(objective.count);
			}
		}

		// Create collection of stats for each objective
		const stats: ObjectiveStats = new Map<string, Map<string, TeamObjectiveStats>>(); // gamemode -> objective -> stats
		scores.forEach((objective: any) => {
			if (!stats.has(objective.gamemode)) {
				stats.set(objective.gamemode, new Map());
			}

			stats.get(objective.gamemode)
				.set(objective.objective, {
					teamNumber: teamNumber,
					scores: objective.scores,
					mean: getMean(objective.scores),
					median: getMedian(objective.scores),
					mode: getMode(objective.scores),
					variance: 0
				});
		});

		return stats;
	}

}

export default new TeamModelService();