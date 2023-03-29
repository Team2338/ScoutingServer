import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IToken, IUser } from '../models';

type GearscoutResponse<T> = Promise<AxiosResponse<T>>;

class ApiService {

	service = axios.create({
		baseURL: 'https://gearitforward.com/api/v1'
	});


	uploadImage = (
		user: IUser,
		gameYear: number,
		robotNumber: string,
		token: IToken,
		image: Blob
	) => {
		const url = `/images/team/${user.teamNumber}/gameYear/${gameYear}/robot/${robotNumber}`;
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

	login = (data: {
		teamNumber: number,
		username: string
	}): GearscoutResponse<IToken> => {
		const url = '/auth/login';
		return this.service.post(url, data);
	};

}

const service = new ApiService();
export default service;
