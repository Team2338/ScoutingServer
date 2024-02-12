import { AxiosError, HttpStatusCode } from 'axios';
import {
	FormErrors,
	ICreateDetailNoteRequest,
	IForm,
	IFormQuestions,
	IPitState,
	IToken,
	IUser,
	LoginErrors,
	UploadErrors
} from '../../models';
import ApiService from '../../services/ApiService';
import FormModelService from '../../services/FormModelService';
import {
	AppDispatch,
	getAllFormsFailed,
	getAllFormsStart,
	getAllFormsSuccess,
	loginFailed,
	loginStart,
	loginSuccess,
	logoutSuccess,
	uploadFailed,
	uploadFormFailed,
	uploadFormStart,
	uploadFormSuccess,
	uploadStart,
	uploadSuccess
} from './Store';

type GetState = () => IPitState;

export const initApp = () => async (dispatch: AppDispatch) => {
	const teamNumber: string = localStorage.getItem('teamNumber');
	const username: string = localStorage.getItem('username');
	const eventCode: string = localStorage.getItem('eventCode');
	const secretCode: string = localStorage.getItem('secretCode');

	// Only login if all information is present
	if (teamNumber && username && eventCode && secretCode) {
		const user: IUser = {
			teamNumber: teamNumber,
			username: username,
			eventCode: eventCode,
			secretCode: secretCode
		};
		const token = JSON.parse(localStorage.getItem('token'));

		if (token) {
			dispatch(loginSuccess({ user, token }));
		} else {
			dispatch(login(user));
		}
	}
};

export const login = (credentials: IUser) => async (dispatch: AppDispatch) => {
	dispatch(loginStart());

	try {
		const response = await ApiService.login({
			teamNumber: Number(credentials.teamNumber),
			username: credentials.username
		});

		const token: IToken = response.data;

		localStorage.setItem('teamNumber', credentials.teamNumber);
		localStorage.setItem('username', credentials.username);
		localStorage.setItem('eventCode', credentials.eventCode);
		localStorage.setItem('secretCode', credentials.secretCode);
		localStorage.setItem('token', JSON.stringify(token));

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

	const user: IUser = getState().login.user;
	const token: IToken = getState().login.token;
	try {
		await ApiService.uploadImage(
			user,
			new Date().getFullYear(),
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

export const uploadForm = (robotNumber: number, questions: IFormQuestions) => async (dispatch: AppDispatch, getState: GetState) => {
	const formState: IForm = FormModelService.convertQuestionsToFormState(
		getState().login.user,
		robotNumber,
		questions
	);
	dispatch(uploadFormStart(formState));

	const request: ICreateDetailNoteRequest = FormModelService.convertQuestionsToRequest(
		getState().login.user,
		new Date().getFullYear(),
		robotNumber,
		questions
	);

	try {
		await ApiService.uploadForm(getState().login.user, request, getState().login.token);
		dispatch(uploadFormSuccess(robotNumber));
	} catch (error) {
		console.log(error);
		const err = error as AxiosError;
		let msg: FormErrors = FormErrors.unknown;
		if (error.response) {
			switch (err.response.status) {
				case HttpStatusCode.Unauthorized: // Fallthrough
				case HttpStatusCode.Forbidden:
					msg = FormErrors.unauthorized;
					break;
			}
		}

		dispatch(uploadFormFailed({
			robotNumber: robotNumber,
			error: msg
		}));
	}
};

export const loadForms = () => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(getAllFormsStart());

	try {
		const questions = await ApiService.getAllForms(
			new Date().getFullYear(),
			getState().login.user,
			getState().login.token
		);

		const forms = FormModelService.convertResponseQuestionsToForms(questions.data);

		dispatch(getAllFormsSuccess(forms));
	} catch (error) {
		console.log(error);
		const err = error as AxiosError;
		let msg: FormErrors = FormErrors.unknown;
		if (error.response) {
			switch (err.response.status) {
				case HttpStatusCode.Unauthorized: // Fallthrough
				case HttpStatusCode.Forbidden:
					msg = FormErrors.unauthorized;
					break;
			}
		}

		dispatch(getAllFormsFailed(msg));
	}
};
