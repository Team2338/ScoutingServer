import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CommentResponse, DetailNoteQuestionResponse, ImageInfo, MatchResponse, Note } from '../models';

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
	};

	hideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/team/${teamNumber}/match/${matchId}/hide`;
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
	};

	unhideMatch = (teamNumber: number, matchId: number, secretCode: string): GearscoutResponse<MatchResponse> => {
		const url = `/v1/team/${teamNumber}/match/${matchId}/unhide`;
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
	};

	getNotesForRobot = (teamNumber: number, eventCode: string, robotNumber: number, secretCode: string): GearscoutResponse<Note[]> => {
		const url = `/v1/notes/team/${teamNumber}/event/${eventCode}/robot/${robotNumber}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.get(url, config);
	};

	getAllNotes = (teamNumber: number, eventCode: string, secretCode: string): GearscoutResponse<Note[]> => {
		const url = `/v1/notes/team/${teamNumber}/event/${eventCode}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.get(url, config);
	};

	getMatchesAsCsv = (teamNumber: number, eventCode: string, secretCode: string): GearscoutResponse<string> => {
		const url = `/v1/team/${teamNumber}/event/${eventCode}/download`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.get(url, config);
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

		return this.service.get(url, config);
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

		return this.service.get(url, config);
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

		return this.service.get(url, config);
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

		return this.service.get(url, config);
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

		return this.service.get(url, config);
	};

}

const service = new GearscoutService();
export default service;
