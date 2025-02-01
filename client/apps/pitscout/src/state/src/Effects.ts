import { AxiosError, HttpStatusCode } from 'axios';
import {
	FormErrors,
	ICreateInspectionRequest,
	IForm,
	IFormQuestions,
	IOfflineCreateInspectionRequest,
	IPitState,
	UploadErrors
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
	recallOfflineFormsSuccess,
	selectEventSuccess,
	uploadFailed,
	uploadFormFailed,
	uploadFormOffline,
	uploadFormStart,
	uploadFormSuccess,
	uploadStart,
	uploadSuccess
} from './Store';
import {
	IEventInfo,
	ITokenModel,
	IUserInfo,
	LoginErrors,
	UserRole
} from '@gearscout/models';
import { authEngine } from '@gearscout/engines';
import {
	loginFailed,
	loginStart,
	loginSuccess,
	logoutSuccess
} from '@gearscout/state';

type GetState = () => IPitState;
const OFFLINE_INSPECTION_LOCATION = 'offlineInspections';

export const initApp = () => async (dispatch: AppDispatch) => {
	attemptEventSelectionFromStorage(dispatch);
	attemptLoginFromStorage(dispatch);
	attemptOfflineInspectionRecallFromStorage(dispatch);
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

const attemptOfflineInspectionRecallFromStorage = (dispatch: AppDispatch) => {
	const offlineRequests: string = localStorage.getItem(OFFLINE_INSPECTION_LOCATION);

	if (offlineRequests) {
		dispatch(recallOfflineFormsSuccess(JSON.parse(offlineRequests)));
	}
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

	const tokenString: string = getState().login.tokenString;
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

	const selectedEvent: IEventInfo = getState().events.selectedEvent;
	const tokenString: string = getState().login.tokenString;
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

	const event: IEventInfo = getState().events.selectedEvent;
	const request: ICreateInspectionRequest = FormModelService.convertQuestionsToRequest({
		user: getState().login.user,
		event: event,
		robotNumber: robotNumber,
		questions: questions
	});

	try {
		await ApiService.uploadForm({
			event: event,
			form: request,
			tokenString: getState().login.tokenString
		});
		dispatch(uploadFormSuccess(robotNumber));
	} catch (error) {
		console.log(error);
		const err = error as AxiosError;

		if (err.code === 'ERR_NETWORK') {
			const offlineRequests: IOfflineCreateInspectionRequest[] =
				getState().forms.offline.filter(r => r.inspection.robotNumber !== robotNumber);
			offlineRequests.push({
				event: event,
				inspection: request
			});

			localStorage.setItem(OFFLINE_INSPECTION_LOCATION, JSON.stringify(offlineRequests));
			dispatch(uploadFormOffline({
				robotNumber: robotNumber,
				requests: offlineRequests
			}));

			return;
		}

		let msg: FormErrors = FormErrors.unknown;
		if (err.response) {
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
			event: getState().events.selectedEvent,
			tokenString: getState().login.tokenString
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
