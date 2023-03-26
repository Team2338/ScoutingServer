import { IPitState, IUser } from '../../models';
import ApiService from '../../services/ApiService';
import {
	AppDispatch,
	loginFailed,
	loginStart,
	loginSuccess,
	logoutSuccess, uploadFailed, uploadStart, uploadSuccess
} from './Store';

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
		// TODO: Call login API
		localStorage.setItem('teamNumber', credentials.teamNumber.toString());
		localStorage.setItem('username', credentials.username);
		localStorage.setItem('eventCode', credentials.eventCode);
		localStorage.setItem('secretCode', credentials.secretCode);

		dispatch(loginSuccess(credentials));
	} catch (exception) {
		dispatch(loginFailed('Oops, something went wrong'));
	}
};

export const logout = () => async (dispatch: AppDispatch) => {
	localStorage.clear();
	dispatch(logoutSuccess());
};

export const uploadImage = (file: Blob, robotNumber: string) => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(uploadStart());

	const user = getState().login.user;
	try {
		await ApiService.uploadImage(
			user,
			2023,
			robotNumber,
			file
		);
		dispatch(uploadSuccess);
	} catch (error) {
		dispatch(uploadFailed());
	}
};
