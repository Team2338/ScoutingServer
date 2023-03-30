import { AxiosError, HttpStatusCode } from 'axios';
import { IPitState, IToken, IUser, LoginErrors, UploadErrors, UserRoles } from '../../models';
import apiService from '../../services/ApiService';
import ApiService from '../../services/ApiService';
import { AppDispatch, loginFailed, loginStart, loginSuccess, logoutSuccess, uploadFailed, uploadStart, uploadSuccess } from './Store';

type GetState = () => IPitState;

export const initApp = () => async (dispatch: AppDispatch) => {
	const teamNumber: string = localStorage.getItem('teamNumber');
	const username: string = localStorage.getItem('username');
	const eventCode: string = localStorage.getItem('eventCode');
	const secretCode: string = localStorage.getItem('secretCode');

	// Only login if all information is present
	if (teamNumber && username && eventCode && secretCode) {
		dispatch(login({
			teamNumber: teamNumber,
			username: username,
			eventCode: eventCode,
			secretCode: secretCode
		}));
	}
};

export const login = (credentials: IUser) => async (dispatch: AppDispatch) => {
	dispatch(loginStart());

	try {
		const response = await apiService.login({
			teamNumber: Number(credentials.teamNumber),
			username: credentials.username
		});

		const token: IToken = response.data;
		if (token.role !== UserRoles.admin) {
			dispatch(loginFailed(LoginErrors.unauthorized));
			return;
		}

		localStorage.setItem('teamNumber', credentials.teamNumber);
		localStorage.setItem('username', credentials.username);
		localStorage.setItem('eventCode', credentials.eventCode);
		localStorage.setItem('secretCode', credentials.secretCode);

		dispatch(loginSuccess({ user: credentials, token }));
	} catch (error) {
		console.error(error);
		dispatch(loginFailed(LoginErrors.unknown));
	}
};

export const logout = () => async (dispatch: AppDispatch) => {
	localStorage.clear();
	dispatch(logoutSuccess());
};

export const uploadImage = (file: Blob, robotNumber: string) => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(uploadStart());

	const user = getState().login.user;
	const token = getState().login.token;
	try {
		await ApiService.uploadImage(
			user,
			2023,
			robotNumber,
			token,
			file
		);
		dispatch(uploadSuccess());
	} catch (error) {
		console.log(error);
		const err = error as AxiosError;
		let msg: UploadErrors = UploadErrors.unknown;
		if (error.response) {
			switch (err.response.status) {
				case HttpStatusCode.Unauthorized: // Fallthrough
				case HttpStatusCode.Forbidden:
					msg = UploadErrors.unauthorized;
					break;
				case HttpStatusCode.PayloadTooLarge:
					msg = UploadErrors.fileTooLarge;
					break;
				case HttpStatusCode.UnsupportedMediaType:
					msg = UploadErrors.badFileType;
					break;
			}
		}

		dispatch(uploadFailed(msg));
	}
};
