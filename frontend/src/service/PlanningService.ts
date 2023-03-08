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
		team.stats.forEach((objective: Map<string, TeamObjectiveStats>, gamemode: string) => {
			if (!Object.hasOwn(plan, gamemode)) {
				plan[gamemode] = {};
			}

			objective.forEach((stats: TeamObjectiveStats, objectiveName: string) => {
				if (!Object.hasOwn(plan[gamemode], objectiveName)) {
					plan[gamemode][objectiveName] = [];
				}

				plan[gamemode][objectiveName].push(stats);
			});
		});
	};

}

const service = new PlanningService();
export default service;
