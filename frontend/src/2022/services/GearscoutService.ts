import axios, { AxiosResponse } from 'axios';
import { Match22 } from '../models/ResponseModel';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});

	static getConfig(secretCode: string) {
		return {
			headers: {
				secretCode: secretCode
			}
		};
	}


	getMatches = (
		teamNumber: number,
		eventCode: string,
		secretCode: string
	): GearscoutResponse<Match22[]> => {
		const url = `/2022/v1/team/${teamNumber}/event/${eventCode}`;
		const config = GearscoutService.getConfig(secretCode);

		return this.service.get(url, config);
	};

	hideMatch = (
		teamNumber: number,
		matchId: number,
		secretCode: string
	): GearscoutResponse<Match22> => {
		const url = `/2022/v1/team/${teamNumber}/match/${matchId}/hide`;
		const config = GearscoutService.getConfig(secretCode);

		return this.service.put(url, null, config);
	};

	unhideMatch = (
		teamNumber: number,
		matchId: number,
		secretCode: string
	): GearscoutResponse<Match22> => {
		const url = `/2022/v1/team/${teamNumber}/match/${matchId}/unhide`;
		const config = GearscoutService.getConfig(secretCode);

		return this.service.put(url, null, config);
	};

}

export default new GearscoutService();
