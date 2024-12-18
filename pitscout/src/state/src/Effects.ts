import { AxiosError, HttpStatusCode } from 'axios';
import {
	FormErrors,
	ICreateDetailNoteRequest, IEventInfo,
	IForm,
	IFormQuestions,
	IPitState,
	ITokenModel,
	IUserInfo,
	LoginErrors,
	UploadErrors
} from '../../models';
import ApiService from '../../services/ApiService';
import FormModelService from '../../services/FormModelService';
import TokenService from '../../services/TokenService';
import {
	AppDispatch,
	getAllFormsFailed,
	getAllFormsStart,
	getAllFormsSuccess,
	loginFailed,
	loginV2Start,
	loginV2Success,
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
	attemptLoginFromStorage(dispatch);
	// TODO: if login succeeded, try to recall last selected event
};

const attemptLoginFromStorage = (dispatch: AppDispatch): boolean => {
	const member = localStorage.getItem('member');
	const tokenString = localStorage.getItem('tokenString');

	if (member && tokenString) {
		// TODO: check if token is still valid
		// TODO: dispatch loginStart if token validation requires an HTTP request
		const token: ITokenModel = TokenService.createTokenModel(tokenString);
		dispatch(loginV2Success({
			user: JSON.parse(member),
			token: token,
			tokenString: tokenString
		}));

		return true;
	}

	return false;
};

export const login = (
	email: string,
	password: string
) => async (dispatch: AppDispatch) => {
	console.log('Logging in as member');
	dispatch(loginV2Start());

	try {
		const response = await ApiService.login(email, password);
		const user: IUserInfo = response.data.user;
		const tokenString: string = response.data.token;
		const token: ITokenModel = TokenService.createTokenModel(tokenString);

		localStorage.setItem('member', JSON.stringify(user));
		localStorage.setItem('tokenString', tokenString);

		dispatch(loginV2Success({
			user: user,
			token: token,
			tokenString: tokenString,
		}));
	} catch (error) {
		console.error('Error logging in as member', error);
		dispatch(loginFailed(LoginErrors.unknown)); // TODO: pass actual error
	}
};

export const logout = () => async (dispatch: AppDispatch) => {
	localStorage.clear();
	dispatch(logoutSuccess());
};

export const uploadImage = (file: Blob, robotNumber: string) => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(uploadStart());

	const selectedEvent: IEventInfo = getState().selectedEvent;
	const tokenString: string = getState().loginv2.tokenString;
	try {
		await ApiService.uploadImage({
			event: selectedEvent,
			robotNumber: robotNumber,
			tokenString: tokenString,
			image: file
		});
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
		robotNumber,
		questions
	);
	dispatch(uploadFormStart(formState));

	const request: ICreateDetailNoteRequest = FormModelService.convertQuestionsToRequest({
		user: getState().loginv2.user,
		event: getState().selectedEvent,
		robotNumber: robotNumber,
		questions: questions
	});

	try {
		await ApiService.uploadForm({
			event: getState().selectedEvent,
			form: request,
			tokenString: getState().loginv2.tokenString
		});
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
		const questions = await ApiService.getAllForms({
			event: getState().selectedEvent,
			tokenString: getState().loginv2.tokenString
		});

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
