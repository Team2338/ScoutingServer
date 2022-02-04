import axios, { AxiosResponse } from 'axios';
import { MatchResponse } from '../models/response.model';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	getMatches = (teamNumber: number, eventCode: string): GearscoutResponse<MatchResponse[]> => {
		return this.service.get(`/v1/team/${teamNumber}/event/${eventCode}`);
	}

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		return this.service.put(
			`/v1/team/${teamNumber}/match/${matchId}/hide`,
			null,
			{
				headers: {
					secretCode: secretCode
				}
			}
		);
	}

	unhideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		return this.service.put(
			`/v1/team/${teamNumber}/match/${matchId}/unhide`,
			null,
			{
				headers: {
					secretCode: secretCode
				}
			}
		);
	}

}

export default new GearscoutService();
