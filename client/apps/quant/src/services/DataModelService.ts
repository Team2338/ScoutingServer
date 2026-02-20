import { CycleSize, Gamemode, ICredentials, ICycle, IMatch, IMatchUi2026 } from '../models/models';

class DataModelService {

	convertToRequestBody(credentials: ICredentials, data: IMatchUi2026): IMatch {
		const autoCyclesBySize = this.groupCyclesBySize(data.autoCycles);
		const teleopCyclesBySize = this.groupCyclesBySize(data.teleopCycles);

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

				{ gamemode: Gamemode.teleop, objective: 'CLIMB_2026', count: data.teleopClimb },
				{ gamemode: Gamemode.teleop, objective: 'SMALL_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.small).length },
				{ gamemode: Gamemode.teleop, objective: 'MEDIUM_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.medium).length },
				{ gamemode: Gamemode.teleop, objective: 'LARGE_CYCLE_2026', count: teleopCyclesBySize.get(CycleSize.large).length },
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

}

export const dataModelService = new DataModelService();
