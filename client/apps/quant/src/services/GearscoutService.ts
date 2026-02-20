import { ICredentials, IMatch, IMatchLineup } from '../models/models';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {
	private service: AxiosInstance = axios.create({
		baseURL: 'https://gearitforward.com/api'
	});

	submitMatch = (user: ICredentials, match: IMatch): GearscoutResponse<void> => {
		const url: string = `/v1/team/${user.teamNumber}`;
		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
				'secretCode': user.secretCode
			}
		};

		return this.service.post(url, match, config);
	};

	getEventSchedule = (gameYear: number, tbaCode: string): GearscoutResponse<IMatchLineup[]> => {
		const url: string = `/v2/schedule/gameYear/${gameYear}/event/${tbaCode}`;
		const timeout: number = 10_000;
		const config: AxiosRequestConfig = {
			timeout: timeout,
			signal: AbortSignal.timeout(timeout)
		};
		return this.service.get(url, config);
	};
}

export const gearscoutService = new GearscoutService();
