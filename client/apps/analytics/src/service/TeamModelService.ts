import { MatchResponse, Objective, ObjectiveStats, Team, TeamObjectiveStats } from '../models';
import { getMean, getMeanList, getMedian, getMode, getSumList } from './Stats';

interface AggregateObjective extends Objective {
	numMatchesToAverage: number;
}

interface ObjectiveSums {
	gamemode: string;
	objective: string;
	scores: number[];
	spacedScores: number[];
	lists: number[][];
}

class TeamModelService {

	/**
	 * Generates a list of Teams from the given match data.
	 * Sorted in ascending order by team number.
	 *
	 * @param matches A list of matches from which to draw data.
	 * @return A list of teams, sorted in ascending order by team number.
	 */
	createTeams = (matches: MatchResponse[]): Team[] => {
		const visibleMatches: MatchResponse[] = matches.filter((match: MatchResponse) => !match.isHidden);
		const groupedMatches: Map<number, MatchResponse[]> = this.groupMatchesByTeamNumber(visibleMatches);

		// Calculate team statistics
		const teams: Team[] = [];
		groupedMatches.forEach((robotMatches: MatchResponse[]) => {
			teams.push(this.createTeam(robotMatches));
		});

		teams.sort((a: Team, b: Team) => a.id - b.id); // Sort by team number, ascending

		return teams;
	};

	private groupMatchesByTeamNumber = (matches: MatchResponse[]): Map<number, MatchResponse[]> => {
		const groupedMatches: Map<number, MatchResponse[]> = new Map();
		for (const match of matches) {
			if (!groupedMatches.has(match.robotNumber)) {
				groupedMatches.set(match.robotNumber, []);
			}

			groupedMatches.get(match.robotNumber).push(match);
		}

		return groupedMatches;
	};

	createTeam = (matches: MatchResponse[]): Team => {
		const teamNumber = matches[0].robotNumber;
		const reducedMatches = this.mergeDuplicateMatches(matches); // Merge duplicates
		const matchNumbers = reducedMatches.map((match: MatchResponse) => match.matchNumber);
		const stats = this.getStats(teamNumber, reducedMatches);
		this.applyModifiers(stats);

		return {
			id: teamNumber,
			matchNumbers: matchNumbers,
			stats: stats
		};
	};

	/**
	 * Returns a list of matches with all duplicates merged.
	 * A duplicate matches are any set of matches whose match numbers are equal.
	 *
	 * @param matches The list of matches, which may contain duplicates.
	 */
	private mergeDuplicateMatches = (matches: MatchResponse[]): MatchResponse[] => {
		const mappedMatches: Map<number, MatchResponse[]> = new Map();
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
		const objectives: Map<string, AggregateObjective> = new Map();

		// Get sum of all objectives
		for (const match of matches) {
			for (const objective of match.objectives) {
				const key = objective.gamemode + objective.objective;

				if (!objectives.has(key)) {
					objectives.set(key, {
						id: null,
						gamemode: objective.gamemode,
						objective: objective.objective,
						count: objective.count,
						list: objective.list ?? [],
						numMatchesToAverage: 1
					});

					continue;
				}

				const value = objectives.get(key);
				value.count += objective.count;
				value.list = this.sumLists(value.list, objective.list ?? []);
				value.numMatchesToAverage++;
			}
		}

		// Convert back into a list of objectives
		const mergedObjectives: Objective[] = [];
		objectives.forEach((value: AggregateObjective) => {
			value.count = (value.count / value.numMatchesToAverage);
			value.list = value.list.map((sum: number) => sum / value.numMatchesToAverage);
			mergedObjectives.push(value);
		});

		return {
			...matches[0],
			objectives: mergedObjectives
		};
	};

	private sumLists = (first: number[], second: number[]): number[] => {
		const result: number[] = [];
		first.forEach((value: number, index: number) => result[index] = value);
		second.forEach((value: number, index: number) => result[index] = (result[index] ?? 0) + value); // Null check in case second list is longer
		return result;
	};

	private getStats = (teamNumber: number, matches: MatchResponse[]): ObjectiveStats => {
		const scores: Map<string, ObjectiveSums> = new Map();
		const matchNumbers: number[] = matches.map((match: MatchResponse) => match.matchNumber);
		const matchNumberToIndexMap: Map<number, number> = new Map();

		// Map each match number to its index in the list
		matchNumbers.forEach((matchNumber: number, index: number) => matchNumberToIndexMap.set(matchNumber, index));

		// Collect a list of counts for each objective
		for (const match of matches) {
			for (const objective of match.objectives) {
				const key = objective.gamemode + objective.objective;
				const matchIndex = matchNumberToIndexMap.get(match.matchNumber);

				if (!scores.has(key)) {
					scores.set(key, {
						gamemode: objective.gamemode,
						objective: objective.objective,
						scores: [],
						spacedScores: Array.from(Array(matchNumbers.length)).fill(undefined),
						lists: []
					});
				}

				scores.get(key).scores.push(objective.count);
				scores.get(key).spacedScores[matchIndex] = objective.count;

				if (objective.list && objective.list.length > 0) {
					scores.get(key).lists.push(objective.list);
				}
			}
		}

		// Create collection of stats for each objective
		const stats: ObjectiveStats = new Map<string, Map<string, TeamObjectiveStats>>(); // gamemode -> objective -> stats
		scores.forEach((objective: ObjectiveSums) => {
			if (!stats.has(objective.gamemode)) {
				stats.set(objective.gamemode, new Map());
			}

			stats.get(objective.gamemode)
				.set(objective.objective, {
					teamNumber: teamNumber,
					matchNumbers: matchNumbers,
					scores: objective.scores,
					spacedScores: objective.spacedScores,
					lists: objective.lists.length > 0 ? objective.lists : null,
					sumList: objective.lists.length > 0 ? getSumList(objective.lists) : null,
					meanList: objective.lists.length > 0 ? getMeanList(objective.lists) : null,
					mean: getMean(objective.scores),
					median: getMedian(objective.scores),
					mode: getMode(objective.scores),
					variance: 0
				});
		});

		return stats;
	};

	private applyModifiers = (stats: ObjectiveStats): void => {
		const autoAccuracy = stats.get('AUTO')?.get('ACCURACY')?.mean;
		const autoShotAttempts = stats.get('AUTO')?.get('HIGH_GOAL_2026');
		if (autoAccuracy !== undefined && autoShotAttempts !== undefined) {
			stats.get('AUTO').set('HIGH_GOAL_SUCCESS_2026', {
				teamNumber: autoShotAttempts.teamNumber,
				matchNumbers: autoShotAttempts.matchNumbers,
				mean: autoShotAttempts.mean * autoAccuracy / 100,
				median: autoShotAttempts.median * autoAccuracy / 100,
				mode: autoShotAttempts.mode * autoAccuracy / 100,
				spacedScores: autoShotAttempts.spacedScores.map(score => score === undefined ? undefined : score * autoAccuracy / 100),
				scores: autoShotAttempts.scores.map(count => count * autoAccuracy / 100), // Not exact, but the best we can do right now
				variance: 0,
				lists: null,
				sumList: null,
				meanList: null,
			});
		}

		const teleopAccuracy = stats.get('TELEOP')?.get('ACCURACY')?.mean;
		const teleopShotAttempts = stats.get('TELEOP')?.get('HIGH_GOAL_2026');
		if (teleopAccuracy !== undefined && teleopShotAttempts !== undefined) {
			stats.get('TELEOP').set('HIGH_GOAL_SUCCESS_2026', {
				teamNumber: teleopShotAttempts.teamNumber,
				matchNumbers: teleopShotAttempts.matchNumbers,
				mean: teleopShotAttempts.mean * teleopAccuracy / 100,
				median: teleopShotAttempts.median * teleopAccuracy / 100,
				mode: teleopShotAttempts.mode * teleopAccuracy / 100,
				spacedScores: autoShotAttempts.spacedScores.map(score => score === undefined ? undefined : score * teleopAccuracy / 100),
				scores: teleopShotAttempts.scores.map(count => count * teleopAccuracy), // Not exact, but the best we can do right now
				variance: 0,
				lists: null,
				sumList: null,
				meanList: null,
			});
		}
	};

}

const service = new TeamModelService();
export default service;
