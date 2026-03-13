import { CycleSize, Gamemode, ICredentials, ICycle, IMatch, IMatchUi2026 } from '../models/models';

type ISizeToQuantityMap = {
	[key in CycleSize]: number;
};

class DataModelService {

	readonly cycleSizeToQuantity: ISizeToQuantityMap = {
		[CycleSize.small]: 8,
		[CycleSize.medium]: 20,
		[CycleSize.large]: 35
	};

	convertToRequestBody(credentials: ICredentials, data: IMatchUi2026): IMatch {
		const autoCyclesBySize = this.groupCyclesBySize(data.autoCycles);
		const teleopCyclesBySize = this.groupCyclesBySize(data.teleopCycles);

		const totalAutoFuel = this.getTotalFuel(data.autoCycles);
		const totalTeleopFuel = this.getTotalFuel(data.teleopCycles);

		return {
			gameYear: 2026,
			eventCode: credentials.eventCode,
			matchNumber: data.matchNumber,
			robotNumber: data.robotNumber,
			creator: credentials.scouterName,
			allianceColor: data.allianceColor,
			objectives: [
				{ gamemode: Gamemode.auto, objective: 'CLIMB_2026', count: data.autoClimb },
				{ gamemode: Gamemode.auto, objective: 'SMALL_CYCLE_2026', count: autoCyclesBySize.get(CycleSize.small).length },
				{ gamemode: Gamemode.auto, objective: 'MEDIUM_CYCLE_2026', count: autoCyclesBySize.get(CycleSize.medium).length },
				{ gamemode: Gamemode.auto, objective: 'LARGE_CYCLE_2026', count: autoCyclesBySize.get(CycleSize.large).length },
				{ gamemode: Gamemode.auto, objective: 'TOTAL_BALLS_2026', count: totalAutoFuel },

				{ gamemode: Gamemode.teleop, objective: 'CLIMB_2026', count: data.teleopClimb },
				{ gamemode: Gamemode.teleop, objective: 'SMALL_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.small).length },
				{ gamemode: Gamemode.teleop, objective: 'MEDIUM_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.medium).length },
				{ gamemode: Gamemode.teleop, objective: 'LARGE_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.large).length },
				{ gamemode: Gamemode.teleop, objective: 'TOTAL_BALLS_2026', count: totalTeleopFuel }
			]
		};
	}

	private groupCyclesBySize(cycles: ICycle[]): Map<CycleSize, ICycle[]> {
		const cyclesBySize: Map<CycleSize, ICycle[]> = new Map();
		for (const key in CycleSize) {
			cyclesBySize.set(key as CycleSize, []);
		}

		for (const cycle of cycles) {
			cyclesBySize.get(cycle.size).push(cycle);
		}

		return cyclesBySize;
	}

	private getTotalFuel(cycles: ICycle[]): number {
		const total = cycles
			.map(cycle => this.cycleSizeToQuantity[cycle.size] * (cycle.accuracy / 100))
			.reduce((sum, next) => sum + next, 0);

		return Math.round(total);
	}

}

export const dataModelService = new DataModelService();
