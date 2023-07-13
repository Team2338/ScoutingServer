import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IToken, IUser } from '../models';
import { ICreateDetailNoteRequest } from '../models/src/RequestModels';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class ApiService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	login = (data: {
		teamNumber: number,
		username: string
	}): GearscoutResponse<IToken> => {
		const url = '/v1/auth/login';
		return this.service.post(url, data);
	};


	uploadImage = (
		user: IUser,
		gameYear: number,
		robotNumber: string,
		token: IToken,
		image: Blob
	) => {
		const url = `/v1/images/team/${user.teamNumber}/gameYear/${gameYear}/event/${user.eventCode}/robot/${robotNumber}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: user.secretCode,
				timeCreated: Date.now(),
				token: JSON.stringify(token)
			}
		};

		const formData = new FormData();
		formData.append('image', image, robotNumber);

		return this.service.post(
			url,
			formData,
			config
		);
	};


	uploadForm = (
		user: IUser,
		form: ICreateDetailNoteRequest,
		token: IToken
	): GearscoutResponse<null> => {
		const url = `/v1/detailnotes/team/${user.teamNumber}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: user.secretCode,
				token: JSON.stringify(token)
			}
		};

		return this.service.post(url, form, config);
	};

}

const service = new ApiService();
export default service;
