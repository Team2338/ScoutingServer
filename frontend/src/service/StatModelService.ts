import { GlobalObjectiveStats, Team, TeamObjectiveStats } from '../models/response.model';
import { getMean, getMedian } from './Stats';

type TeamStat = {
	teamNumber: number;
	objectiveName: string;
	gamemode: string;
	mean: number;
}

class StatModelService {

	calculateGlobalStats = (teams: Team[]): GlobalObjectiveStats[] => {
		const groupedTeamStats = this.getTeamStatsGroupedByObjective(teams);
		const globalStats: GlobalObjectiveStats[] = this.getGlobalStats(groupedTeamStats);

		return globalStats;
	};

	/**
	 * Gets a map of objectives to a list of stat entries (one from each team).
	 * The key irrelevant; all the matters is the list of team stats associated with it.
	 *
	 * @param teams a list of teams on which to calculate statistics.
	 */
	private getTeamStatsGroupedByObjective = (teams: Team[]): Map<string, TeamStat[]> => {
		const groupedTeamStats = new Map<string, TeamStat[]>();

		for (const team of teams) {
			team.stats.forEach((objectives: Map<string, TeamObjectiveStats>, gamemodeName: string) => {
				objectives.forEach((teamStats: TeamObjectiveStats, objectiveName: string) => {
					const key = gamemodeName + objectiveName;
					if (!groupedTeamStats.has(key)) {
						groupedTeamStats.set(key, []);
					}

					groupedTeamStats.get(key).push({
						teamNumber: team.id,
						objectiveName: objectiveName,
						gamemode: gamemodeName,
						mean: teamStats.mean
					});
				});
			});
		}

		return groupedTeamStats;
	};

	private getGlobalStats = (groupedTeamStats: Map<string, TeamStat[]>): GlobalObjectiveStats[] => {
		const globalStats: GlobalObjectiveStats[] = [];

		groupedTeamStats.forEach((teamStats: TeamStat[]) => {
			const scores: number[] = [];
			const globalStat: GlobalObjectiveStats = {
				name: teamStats[0].objectiveName,
				gamemode: teamStats[0].gamemode,
				scores: [],
				stats: null
			}

			// Append each team's score
			for (const teamStat of teamStats) {
				scores.push(teamStat.mean);
				globalStat.scores.push({
					teamNumber: teamStat.teamNumber,
					mean: teamStat.mean
				});
			}

			// Aggregate scores
			globalStat.stats = {
				mean: getMean(scores),
				median: getMedian(scores)
			};

			globalStats.push(globalStat);
		});

		return globalStats;
	};

}

const service = new StatModelService();
export default service;
