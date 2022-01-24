import axios, { AxiosResponse } from 'axios';
import { Match } from '../models/response.model';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	getMatches = (teamNumber: number, eventCode: string): GearscoutResponse<Match[]> => {
		return this.service.get(`/v1/team/${teamNumber}/event/${eventCode}`);
	}

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<Match> => {
		return this.service.put(
			`/v1/hide/team/${teamNumber}/match/${matchId}`,
			null,
			{
				headers: {
					secretCode: secretCode
				}
			}
		);
	}

	unhideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<Match> => {
		return this.service.put(
			`/v1/unhide/team/${teamNumber}/match/${matchId}`,
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
