import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { InspectionQuestionResponse, MatchResponse, ImageInfoResponse } from '../models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	private http: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_APP_SERVER_URL
	});


	getMatches = (teamNumber: number, gameYear: number, eventCode: string, secretCode: string): GearscoutResponse<MatchResponse[]> => {
		const url = `/v1/team/${teamNumber}/gameYear/${gameYear}/event/${eventCode}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.get(url, config);
	};

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/team/${teamNumber}/match/${matchId}/hide`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.put(
			url,
			null,
			config
		);
	};

	unhideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/team/${teamNumber}/match/${matchId}/unhide`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.put(
			url,
			null,
			config
		);
	};

	getImageInfoForRobot = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		robotNumber: number;
		secretCode: string;
	}): GearscoutResponse<ImageInfoResponse> => {
		const url = `/v1/images/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}/robot/${data.robotNumber}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: data.secretCode
			}
		};

		return this.http.get(url, config);
	};

	getImageInfoForEvent = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		secretCode: string;
	}): GearscoutResponse<ImageInfoResponse[]> => {
		const url = `/v1/images/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: data.secretCode
			}
		};

		return this.http.get(url, config);
	};

	getInspections = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		secretCode: string;
	}): GearscoutResponse<InspectionQuestionResponse[]> => {
		const url: string = `/v1/detailnotes/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: data.secretCode
			}
		};

		return this.http.get(url, config);
	};

}

const service = new GearscoutService();
export default service;
