import { Plan, Team, TeamObjectiveStats } from '../models';

class PlanningService {

	createPlan(...teams: Team[]) {
		const plan: Plan = {
			teams: [],
			gamemodes: {}
		};

		const filteredTeams: Team[] = teams.filter((team: Team) => !!team);

		filteredTeams.forEach((team: Team, index: number) => {
			console.log('Team: ', team.id);
			plan.teams.push(team);
			team.stats.forEach((objective: Map<string, TeamObjectiveStats>, gamemode: string) => {
				// Add the gamemodes for this team
				if (!Object.hasOwn(plan.gamemodes, gamemode)) { // Insert empty gamemode if not yet present
					plan.gamemodes[gamemode] = {
						name: gamemode,
						objectives: {}
					};
					console.log('  Adding gamemode ', gamemode);
				}

				// Add the objectives for this team->gamemode
				objective.forEach((stats: TeamObjectiveStats, objectiveName: string) => {
					if (!Object.hasOwn(plan.gamemodes[gamemode].objectives, objectiveName)) { // Insert empty objective if not yet present
						plan.gamemodes[gamemode].objectives[objectiveName] = {
							name: objectiveName,
							stats: Array.apply(null, Array(filteredTeams.length)) // Create an array of nulls
						};
						console.log(`    Adding objective ${gamemode} | ${objectiveName}`);
					}

					plan.gamemodes[gamemode]
						.objectives[objectiveName]
						.stats[index] = stats;
				});
			});
		});

		return plan;
	};
}

const service = new PlanningService();
export default service;
