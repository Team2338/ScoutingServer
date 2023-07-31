import {configureStore, createAction, createReducer} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {FormErrors, IForm, IPitState, IToken, IUser, LoadStatus, LoginErrors, UploadErrors} from '../../models';

export const loginStart = createAction('login/login-start');
export const loginSuccess = createAction<{ user: IUser, token: IToken }>('login/login-success');
export const loginFailed = createAction<LoginErrors>('login/login-failed');
export const logoutSuccess = createAction('login/logout-success');
export const clearLoginError = createAction('login/clear-error');

export const uploadStart = createAction('upload/upload-start');
export const uploadSuccess = createAction('upload/upload-success');
export const uploadFailed = createAction<UploadErrors>('upload/upload-failed');
export const clearUploadError = createAction('upload/clear-error');

export const createForm = createAction<number>('form/create-form');
export const selectForm = createAction<number>('form/select-form');
export const uploadFormStart = createAction<IForm>('form/upload-form-start');
export const uploadFormSuccess = createAction<number>('form/upload-form-success');
export const uploadFormFailed = createAction<{ robotNumber: number, error: FormErrors }>('form/upload-form-failed');
// export const clearFormError = createAction('form/clear-error');

const initialState: IPitState = {
	login: {
		loadStatus: LoadStatus.none,
		error: null,
		user: null,
		token: null
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
	}
};

const reducer = createReducer(initialState, builder => {
	builder
		.addCase(loginStart, (state: IPitState) => {
			state.login.loadStatus = LoadStatus.loading;
			state.login.error = null;
		})
		.addCase(loginSuccess, (state: IPitState, action) => {
			state.login.loadStatus = LoadStatus.success;
			state.login.user = action.payload.user;
			state.login.token = action.payload.token;
		})
		.addCase(loginFailed, (state: IPitState, action) => {
			state.login.loadStatus = LoadStatus.failed;
			state.login.error = action.payload;
		})
		.addCase(logoutSuccess, (state: IPitState) => {
			state.login = initialState.login;
		})
		.addCase(clearLoginError, (state: IPitState) => {
			state.login.error = null;
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
		.addCase(createForm, (state: IPitState, action) => {
			if (state.forms.robots.includes(action.payload)) {
				// TODO: put some kind of error?
				console.error('Tried to create form, but one already existed for that robot');
				return;
			}

			state.forms.robots.push(action.payload);
			state.forms.robots.sort((a: number, b: number) => a - b);
			state.forms.data[action.payload] = {
				loadStatus: LoadStatus.none,
				error: null,
				robotNumber: action.payload,
				questions: []
			}
		})
		.addCase(selectForm, (state: IPitState, action) => {
			if (!state.forms.robots.includes(action.payload)) {
				console.error('Tried to select form, but one does not exist for that robot');
			}

			state.forms.selected = state.forms.data[action.payload];
		})
		.addCase(uploadFormStart, (state: IPitState, action) => {
			state.forms.data[action.payload.robotNumber] = action.payload;
			state.forms.data[action.payload.robotNumber].loadStatus = LoadStatus.loading;
		})
		.addCase(uploadFormSuccess, (state: IPitState, action) => {
			state.forms.data[action.payload].loadStatus = LoadStatus.success;
		})
		.addCase(uploadFormFailed, (state: IPitState, action) => {
			state.forms.data[action.payload.robotNumber].loadStatus = LoadStatus.failed;
			state.forms.data[action.payload.robotNumber].error = action.payload.error;
		})
	;
});

export const store = configureStore({
	reducer: reducer
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IPitState> = useSelector;

export const selectIsLoggedIn = (state: IPitState): boolean => state.login.loadStatus === LoadStatus.success;
