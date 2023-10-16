import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CommentResponse, DetailNoteQuestionResponse, ImageInfo, MatchResponse } from '../models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class GearscoutService {

	private http: AxiosInstance = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	getMatches = (teamNumber: number, eventCode: string, secretCode: string): GearscoutResponse<MatchResponse[]> => {
		const url = `/v1/team/${teamNumber}/event/${eventCode}`;
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

	getMatchesAsCsv = (teamNumber: number, eventCode: string, secretCode: string): GearscoutResponse<string> => {
		const url = `/v1/team/${teamNumber}/event/${eventCode}/download`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.http.get(url, config);
	};

	getImageInfo = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		robotNumber: number;
		secretCode: string;
	}): GearscoutResponse<ImageInfo> => {
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
	}): GearscoutResponse<ImageInfo[]> => {
		const url = `/v1/images/team/${data.teamNumber}/gameYear/${data.gameYear}/event/${data.eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: data.secretCode
			}
		};

		return this.http.get(url, config);
	};

	getImageContent = (data: {
		imageId: number;
		secretCode: string;
	}): GearscoutResponse<ArrayBuffer> => {
		const url = `/v1/images/${data.imageId}`;
		const config: AxiosRequestConfig = {
			responseType: 'arraybuffer',
			headers: {
				secretCode: data.secretCode
			}
		};

		return this.http.get(url, config);
	};

	getDetailNotes = (data: {
		teamNumber: number;
		gameYear: number;
		eventCode: string;
		secretCode: string;
	}): GearscoutResponse<DetailNoteQuestionResponse[]> => {
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
