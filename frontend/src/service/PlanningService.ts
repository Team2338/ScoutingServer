import { Plan, Team, TeamObjectiveStats } from '../models';

class PlanningService {

	createPlan(first: Team, second: Team, third: Team): Plan {
		const plan = {};

		this.addTeamToPlan(plan, first);
		this.addTeamToPlan(plan, second);
		this.addTeamToPlan(plan, third);

		return plan;
	};

	private addTeamToPlan(plan: Plan, team: Team) {
		console.log('Team: ', team.id);
		team.stats.forEach((objective: Map<string, TeamObjectiveStats>, gamemode: string) => {
			if (!Object.hasOwn(plan, gamemode)) {
				plan[gamemode] = {};
				console.log('  Adding gamemode ', gamemode);
			}

			objective.forEach((stats: TeamObjectiveStats, objectiveName: string) => {
				if (!Object.hasOwn(plan[gamemode], objectiveName)) {
					plan[gamemode][objectiveName] = [];
					console.log('    Adding objective ', objectiveName);
				}

				plan[gamemode][objectiveName].push(stats);
			});
		});
	};

}

const service = new PlanningService();
export default service;
