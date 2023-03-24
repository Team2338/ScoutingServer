import { IUser } from '../../models';
import {
	AppDispatch,
	loginFailed,
	loginStart,
	loginSuccess,
	logoutSuccess
} from './Store';

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
}

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
}

export const logout = () => async (dispatch: AppDispatch) => {
	localStorage.clear();
	dispatch(logoutSuccess());
}
