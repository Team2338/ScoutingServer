import axios, { AxiosResponse } from 'axios';
import { MatchResponse, NewNote, Note } from '../models/response.model';

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

	addNote = (teamNumber: number, secretCode: string, note: NewNote): GearscoutResponse<null> => {
		const url = `/v1/notes/team/${teamNumber}`;
		const config = {
			headers: {
				secretCode: secretCode
			}
		};

		return this.service.post(
			url,
			note,
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

}

export default new GearscoutService();
