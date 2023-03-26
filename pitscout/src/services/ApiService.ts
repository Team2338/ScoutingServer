import axios, { AxiosResponse } from 'axios';
import { IUser } from '../models';

class ApiService {

	service = axios.create({
		baseURL: 'https://gearitforward.com/api/v1'
	});


	uploadImage = (
		user: IUser,
		gameYear: number,
		robotNumber: string,
		image: Blob
	) => {

		const url = `/team/${user.teamNumber}/gameYear/${gameYear}/robot/${robotNumber}`;
		const config = {
			headers: {
				secretCode: user.secretCode,
				creator: user.username,
				timeCreated: Date.now()
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

}

const service = new ApiService();
export default service;
