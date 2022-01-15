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

}

export default new GearscoutService();
