import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ICreateDetailNoteRequest, IDetailNoteQuestionResponse } from '../models';
import { IEventInfo, ILoginResponse } from '@gearscout/models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class ApiService {

	service = axios.create({
		baseURL: import.meta.env.VITE_APP_SERVER_URL
	});


	login = (email: string, password: string): GearscoutResponse<ILoginResponse> => {
		const url = '/v2/auth/login';
		return this.service.post(url, {
			email: email,
			password: password
		});
	};


	getEvents = (tokenString: string): GearscoutResponse<IEventInfo[]> => {
		const url = '/v1/events';
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${tokenString}`
			}
		};

		return this.service.get(url, config);
	};


	uploadImage = (data: {
		event: IEventInfo;
		robotNumber: string;
		tokenString: string;
		image: Blob;
	}): GearscoutResponse<null> => {
		const { event } = data;
		const url = `/v1/images/team/${event.teamNumber}/gameYear/${event.gameYear}/event/${event.eventCode}/robot/${data.robotNumber}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: event.secretCode,
				timeCreated: Date.now(),
				Authorization: `Bearer ${data.tokenString}`
			}
		};

		const formData = new FormData();
		formData.append('image', data.image, data.robotNumber);

		return this.service.post(
			url,
			formData,
			config
		);
	};


	uploadForm = (data: {
		event: IEventInfo;
		form: ICreateDetailNoteRequest;
		tokenString: string;
	}): GearscoutResponse<null> => {
		const url = `/v1/detailnotes/team/${ data.event.teamNumber }`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: data.event.secretCode,
				Authorization: `Bearer ${data.tokenString}`
			}
		};

		return this.service.post(url, data.form, config);
	};


	getAllForms = (data: {
		event: IEventInfo;
		tokenString: string;
	}): GearscoutResponse<IDetailNoteQuestionResponse[]> => {
		const { event } = data;
		const url: string = `/v1/detailnotes/team/${event.teamNumber}/gameYear/${event.gameYear}/event/${event.eventCode}`;
		const config: AxiosRequestConfig = {
			headers: {
				secretCode: event.secretCode,
				Authorization: `Bearer ${data.tokenString}`
			}
		};

		return this.service.get(url, config);
	};

}

const service = new ApiService();
export default service;
