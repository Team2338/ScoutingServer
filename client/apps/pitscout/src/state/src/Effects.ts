import { AxiosError, HttpStatusCode } from 'axios';
import {
	FormErrors,
	ICreateInspectionRequest,
	IForm,
	IFormQuestions,
	IPitState,
	LoginErrors,
	UploadErrors,
} from '../../models';
import ApiService from '../../services/ApiService';
import FormModelService from '../../services/FormModelService';
import {
	AppDispatch,
	getAllFormsFailed,
	getAllFormsStart,
	getAllFormsSuccess,
	getEventsFailed,
	getEventsStart,
	getEventsSuccess,
	loginFailed,
	loginStart,
	loginSuccess,
	logoutSuccess,
	selectEventSuccess,
	uploadFailed,
	uploadFormFailed,
	uploadFormStart,
	uploadFormSuccess,
	uploadStart,
	uploadSuccess
} from './Store';
import {
	IEventInfo,
	ITokenModel,
	IUserInfo,
	UserRole
} from '@gearscout/models';
import { authEngine } from '@gearscout/engines';

type GetState = () => IPitState;

export const initApp = () => async (dispatch: AppDispatch) => {
	attemptEventSelectionFromStorage(dispatch);
	attemptLoginFromStorage(dispatch);
};

const attemptLoginFromStorage = (dispatch: AppDispatch): boolean => {
	const member = localStorage.getItem('member');
	const tokenString = localStorage.getItem('tokenString');

	if (member && tokenString) {
		// TODO: check if token is still valid
		// TODO: dispatch loginStart if token validation requires an HTTP request
		const token: ITokenModel = authEngine.createTokenModel(tokenString);
		dispatch(loginSuccess({
			user: JSON.parse(member),
			token: token,
			tokenString: tokenString
		}));

		return true;
	}

	return false;
};

const attemptEventSelectionFromStorage = (dispatch: AppDispatch): boolean => {
	const selectedEvent: string = localStorage.getItem('selectedEvent');

	if (selectedEvent) {
		dispatch(selectEvent(JSON.parse(selectedEvent)));
		return true;
	}

	return false;
};

export const login = (
	email: string,
	password: string
) => async (dispatch: AppDispatch) => {
	console.log('Logging in as member');
	dispatch(loginStart());

	try {
		const response = await ApiService.login(email, password);
		const user: IUserInfo = response.data.user;
		const tokenString: string = response.data.token;
		const token: ITokenModel = authEngine.createTokenModel(tokenString);

		if (user.role !== UserRole.admin && user.role !== UserRole.superAdmin) {
			dispatch(loginFailed(LoginErrors.unauthorized));
		}

		localStorage.setItem('member', JSON.stringify(user));
		localStorage.setItem('tokenString', tokenString);

		console.log('Successfully logged in as member');
		dispatch(loginSuccess({
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

export const getEvents = () => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(getEventsStart());

	const tokenString: string = getState().loginv2.tokenString;
	try {
		const response = await ApiService.getEvents(tokenString);
		const events: IEventInfo[] = response.data;
		dispatch(getEventsSuccess(events));
	} catch (error) {
		console.error('Error retrieving events', error);
		dispatch(getEventsFailed(error.message));
	}
};

export const selectEvent = (event: IEventInfo) => async (dispatch: AppDispatch) => {
	localStorage.setItem('selectedEvent', JSON.stringify(event));
	dispatch(selectEventSuccess(event));
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

	const request: ICreateInspectionRequest = FormModelService.convertQuestionsToRequest({
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
