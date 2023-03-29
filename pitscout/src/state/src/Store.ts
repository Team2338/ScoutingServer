import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { IPitState, IUser, LoadStatus, LoginErrors } from '../../models';

export const loginStart = createAction('login/login-start');
export const loginSuccess = createAction<IUser>('login/login-success');
export const loginFailed = createAction<LoginErrors>('login/login-failed');
export const logoutSuccess = createAction('login/logout-success');
export const clearLoginError = createAction('login/clear-error');

export const uploadStart = createAction('upload/upload-start');
export const uploadSuccess = createAction('upload/upload-success');
export const uploadFailed = createAction('upload/upload=failed');

const initialState: IPitState = {
	login: {
		loadStatus: LoadStatus.none,
		error: null,
		user: null
	},
	upload: {
		loadStatus: LoadStatus.none
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
			state.login.user = action.payload;
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
		.addCase(uploadFailed, (state: IPitState) => {
			state.upload.loadStatus = LoadStatus.failed;
		});
});

export const store = configureStore({
	reducer: reducer
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IPitState> = useSelector;

export const selectIsLoggedIn = (state: IPitState): boolean => state.login.loadStatus === LoadStatus.success;
