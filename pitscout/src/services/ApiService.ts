import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ILoginResponse, IUser } from '../models';
import { ICreateDetailNoteRequest, IDetailNoteQuestionResponse } from '../models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class ApiService {

	service = axios.create({
		baseURL: process.env.REACT_APP_SERVER_URL
	});


	login = (email: string, password: string): GearscoutResponse<ILoginResponse> => {
		const url = '/v2/auth/login';
		return this.service.post(url, {
			email: email,
			password: password
		});
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


	getAllForms = (
		gameYear: number,
		user: IUser,
		token: IToken
	): GearscoutResponse<IDetailNoteQuestionResponse[]> => {
		const url: string = `/v1/detailnotes/team/${user.teamNumber}/gameYear/${gameYear}/event/${user.eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: user.secretCode
			}
		};

		return this.service.get(url, config);
	};

}

const service = new ApiService();
export default service;
