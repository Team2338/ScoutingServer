import { MatchResponse, Objective, ObjectiveStats, Team, TeamObjectiveStats } from '../models/response.model';

class TeamModelService {

	createTeam = (matches: MatchResponse[]): Team => {
		const reducedMatches = this.mergeDuplicateMatches(matches); // Merge duplicates
		const stats = this.getStats(reducedMatches);

		return {
			id: matches[0].robotNumber,
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

	private getStats = (matches: MatchResponse[]): ObjectiveStats => {
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
					scores: objective.scores,
					mean: this.getMean(objective.scores),
					median: this.getMedian(objective.scores),
					mode: this.getMode(objective.scores),
					variance: 0
				});
		});

		return stats;
	}

	private getMean = (scores: number[]): number => {
		const sum = scores.reduce((accumulator: number, current: number) => accumulator + current, 0);
		return sum / scores.length;
	};

	private getMedian = (scores: number[]): number => {
		if (scores.length < 2) {
			return scores[0];
		}

		const sorted = scores.slice().sort((a: number, b: number) => a - b);
		const middleIndex = sorted.length / 2;

		// If there's an even number of elements, take average of both middle elements
		if (sorted.length % 2 === 0) {
			return (sorted[middleIndex] + sorted[middleIndex - 1]) / 2
		}

		// Else return middle element
		return sorted[middleIndex];
	};

	private getMode = (scores: number[]): number => {

		// Create list of frequencies
		const frequencies = new Map<number, number>();
		for (const score of scores) {
			if (!frequencies.has(score)) {
				frequencies.set(score, 0);
			}

			const nextFrequency = frequencies.get(score) + 1;
			frequencies.set(score, nextFrequency);
		}

		// Select score of highest frequency
		let mode = scores[0];
		frequencies.forEach((frequency: number, score: number) => {
			if (frequency > frequencies.get(mode)) {
				mode = score;
			}
		});

		return mode;
	};

}

export default new TeamModelService();
