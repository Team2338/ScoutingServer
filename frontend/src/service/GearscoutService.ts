import axios, { AxiosResponse } from 'axios';
import { MatchResponse } from '../models/response.model';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	getMatches = (teamNumber: number, eventCode: string, secretCode: string): GearscoutResponse<MatchResponse[]> => {
		const url = `/v1/team/${teamNumber}/event/${eventCode}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.get(url, config);
	}

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/hide/team/${teamNumber}/match/${matchId}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.put(
			url,
			null,
			config
		);
	}

	unhideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/unhide/team/${teamNumber}/match/${matchId}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.put(
			url,
			null,
			config
		);
	}

}

export default new GearscoutService();
