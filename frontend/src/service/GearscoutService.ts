import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
	CommentResponse,
	InspectionQuestionResponse,
	MatchResponse,
	ImageInfoResponse,
	ICreateUserRequest, EventInfo
} from '../models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	private http: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_APP_SERVER_URL
	});


	login = (email: string, password: string): GearscoutResponse<string> => {
		const url: string = '/v2/auth/login';
		return this.http.post(url, {
			email: email,
			password: password
		});
	};

	/**
	 * @param data Information about the new user
	 * @returns A serialized auth token
	 */
	createUser = (data: ICreateUserRequest): GearscoutResponse<string> => {
		const url: string = '/v2/user';
		return this.http.post(url, data);
	};

	getEvents = (tokenString: string): GearscoutResponse<EventInfo[]> => {
		const url: string = '/v2/events';
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${tokenString}`
			}
		};

		return this.http.get(url, config);
	};

	getMatches = (teamNumber: number, gameYear: number, eventCode: string, secretCode: string): GearscoutResponse<MatchResponse[]> => {
		const url: string = `/v1/team/${teamNumber}/gameYear/${gameYear}/event/${eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.get(url, config);
	};

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url: string = `/v1/team/${teamNumber}/match/${matchId}/hide`;
		const config: AxiosRequestConfig = {
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
		const url: string = `/v1/team/${teamNumber}/match/${matchId}/unhide`;
		const config: AxiosRequestConfig = {
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

	getMatchesAsCsv = (teamNumber: number, gameYear: number, eventCode: string, secretCode: string): GearscoutResponse<string> => {
		const url: string = `/v1/team/${teamNumber}/gameYear/${gameYear}/event/${eventCode}/download`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.get(url, config);
	};

	getImageInfoForRobot = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		robotNumber: number;
		secretCode: string;
	}): GearscoutResponse<ImageInfoResponse> => {
		const url: string = `/v1/images/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}/robot/${data.robotNumber}`;
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
		const url: string = `/v1/images/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}`;
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

	getCommentsForEvent = (data: {
		teamNumber: number,
		gameYear: number;
		eventCode: string;
		secretCode: string;
	}): GearscoutResponse<CommentResponse[]> => {
		const url: string = `/v2/notes/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}`;
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
