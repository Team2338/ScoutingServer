import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
	FormErrors,
	IForm,
	IPitState,
	UploadErrors,
	TGameYear
} from '../../models';
import {
	IEventInfo,
	LoadStatus,
	LoginStatus
} from '@gearscout/models';
import {
	loginSlice,
	logoutSuccess
} from '@gearscout/state';

export const serviceWorkerInstalled = createAction<ServiceWorker>('serviceWorker/updated');

export const getEventsStart = createAction('event/get-events-start');
export const getEventsSuccess = createAction<IEventInfo[]>('event/get-events-success');
export const getEventsFailed = createAction<string>('event/get-events-failure');
export const selectEventSuccess = createAction<IEventInfo>('event/selectEvent');

export const uploadStart = createAction('upload/upload-start');
export const uploadSuccess = createAction('upload/upload-success');
export const uploadFailed = createAction<UploadErrors>('upload/upload-failed');
export const clearUploadError = createAction('upload/clear-error');
export const resetImageUpload = createAction('upload/reset');

export const createForm = createAction<number>('form/create-form');
export const selectForm = createAction<number>('form/select-form');
export const uploadFormStart = createAction<IForm>('form/upload-form-start');
export const uploadFormSuccess = createAction<number>('form/upload-form-success');
export const uploadFormFailed = createAction<{ robotNumber: number, error: FormErrors }>('form/upload-form-failed');
export const getAllFormsStart = createAction('form/get-all-start');
export const getAllFormsSuccess = createAction<{ forms: Record<number, IForm>, robots: number[] }>('form/get-all-success');
export const getAllFormsFailed = createAction<string>('form/get-all-failed');
// export const clearFormError = createAction('form/clear-error');

export const closeSnackbar = createAction('snackbar/clear');

const initialState: IPitState = {
	serviceWorker: {
		updated: false,
		sw: null
	},
	login: {
		loginStatus: LoginStatus.none,
		error: null,
		role: null,
		tokenString: null,
		token: null,
		user: null
	},
	events: {
		loadStatus: LoadStatus.none,
		error: null,
		list: [],
		byYear: {},
		years: [],
		selectedEvent: null
	},
	upload: {
		loadStatus: LoadStatus.none,
		error: null
	},
	forms: {
		loadStatus: LoadStatus.none,
		error: null,
		selected: null,
		robots: [],
		data: {}
	},
	snackbar: {
		message: null,
		severity: 'error',
		isOpen: false
	}
};

const oldReducer = createReducer(initialState, builder => {
	builder
		.addCase(logoutSuccess, () => {
			return initialState;
		})
		.addCase(serviceWorkerInstalled, (state: IPitState, action) => {
			state.serviceWorker.updated = true;
			state.serviceWorker.sw = action.payload;
		})
		.addCase(getEventsStart, (state: IPitState) => {
			state.events.loadStatus = getNextStatusOnLoad(state.events.loadStatus);
		})
		.addCase(getEventsSuccess, (state: IPitState, action) => {
			const sortedEvents: IEventInfo[] = action.payload.toSorted((a, b) => b.gameYear - a.gameYear);
			const groupedEvents: Record<TGameYear, IEventInfo[]> = {};
			const years: TGameYear[] = [];
			for (const event of sortedEvents) {
				if (!Object.hasOwn(groupedEvents, event.gameYear)) {
					groupedEvents[event.gameYear] = [];
					years.push(event.gameYear);
				}

				groupedEvents[event.gameYear].push(event);
			}

			state.events.loadStatus = LoadStatus.success;
			state.events.list = sortedEvents;
			state.events.byYear = groupedEvents;
			state.events.years = years;
		})
		.addCase(getEventsFailed, (state: IPitState, action) => {
			state.events.loadStatus = getNextStatusOnFail(state.events.loadStatus);
			state.events.error = action.payload;
			showSnackbar(state, 'error', action.payload);
		})
		.addCase(selectEventSuccess, (state: IPitState, action) => {
			state.events.selectedEvent = action.payload;
			state.forms = initialState.forms;
		})
		.addCase(uploadStart, (state: IPitState) => {
			state.upload.loadStatus = LoadStatus.loading;
		})
		.addCase(uploadSuccess, (state: IPitState) => {
			state.upload.loadStatus = LoadStatus.success;
		})
		.addCase(uploadFailed, (state: IPitState, action) => {
			state.upload.loadStatus = LoadStatus.failed;
			state.upload.error = action.payload;
		})
		.addCase(clearUploadError, (state: IPitState) => {
			state.upload.error = null;
		})
		.addCase(resetImageUpload, (state: IPitState) => {
			state.upload = initialState.upload;
		})
		.addCase(createForm, (state: IPitState, action) => {
			if (state.forms.robots.includes(action.payload)) {
				const msg: string = 'Tried to create form, but one already existed for that robot';
				console.error(msg);
				showSnackbar(state, 'error', msg);
				return;
			}

			state.forms.robots.push(action.payload);
			state.forms.robots.sort((a: number, b: number) => a - b);
			state.forms.data[action.payload] = {
				loadStatus: LoadStatus.none,
				error: null,
				robotNumber: action.payload,
				questions: {}
			};
		})
		.addCase(selectForm, (state: IPitState, action) => {
			if (!state.forms.robots.includes(action.payload)) {
				console.error('Tried to select form, but one does not exist for that robot');
			}

			state.forms.selected = action.payload;
		})
		.addCase(uploadFormStart, (state: IPitState, action) => {
			state.forms.data[action.payload.robotNumber] = action.payload;
			state.forms.data[action.payload.robotNumber].loadStatus = LoadStatus.loading;
		})
		.addCase(uploadFormSuccess, (state: IPitState, action) => {
			state.forms.data[action.payload].loadStatus = LoadStatus.success;
			showSnackbar(state, 'success', 'Successfully submitted inspection');
		})
		.addCase(uploadFormFailed, (state: IPitState, action) => {
			state.forms.data[action.payload.robotNumber].loadStatus = LoadStatus.failed;
			state.forms.data[action.payload.robotNumber].error = action.payload.error;
			showSnackbar(state, 'error', action.payload.error);
		})
		.addCase(getAllFormsStart, (state: IPitState) => {
			state.forms.loadStatus = getNextStatusOnLoad(state.forms.loadStatus);
		})
		.addCase(getAllFormsSuccess, (state: IPitState, action) => {
			state.forms.loadStatus = LoadStatus.success;
			state.forms.data = action.payload.forms;
			state.forms.robots = action.payload.robots;
		})
		.addCase(getAllFormsFailed, (state: IPitState, action) => {
			state.forms.loadStatus = LoadStatus.failed;
			state.forms.error = action.payload;
			showSnackbar(state, 'error', action.payload);
		})
		.addCase(closeSnackbar, (state: IPitState) => {
			state.snackbar.isOpen = false;
		})
	;
});

const reducer = (state = initialState, action) => {
	return {
		...(oldReducer(state, action)),
		login: loginSlice(state.login, action)
	};
};

export const store = configureStore({
	reducer: reducer
});

const getNextStatusOnLoad = (previousStatus: LoadStatus): LoadStatus => {
	if (
		previousStatus === LoadStatus.success
		|| previousStatus === LoadStatus.loadingWithPriorSuccess
		|| previousStatus === LoadStatus.failedWithPriorSuccess
	) {
		return LoadStatus.loadingWithPriorSuccess;
	}

	return LoadStatus.loading;
};

const getNextStatusOnFail = (previousStatus: LoadStatus): LoadStatus => {
	if (previousStatus === LoadStatus.loadingWithPriorSuccess) {
		return LoadStatus.failedWithPriorSuccess;
	}

	return LoadStatus.failed;
};

const showSnackbar = (state: IPitState, severity: 'error' | 'success', message: string): void => {
	state.snackbar.severity = severity;
	state.snackbar.message = message;
	state.snackbar.isOpen = true;
};

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IPitState> = useSelector;

export const selectIsLoggedIn = (state: IPitState): boolean => state.login.loginStatus === LoginStatus.loggedIn;
