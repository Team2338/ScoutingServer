import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { IPitState, IUser } from '../../models';

export const loginStart = createAction('login/login-start');
export const loginSuccess = createAction<IUser>('login/login-success');
export const loginFailed = createAction<string>('login/login-failed');
export const logoutSuccess = createAction('login/logout-success');

const initialState: IPitState = {
	login: {
		loadStatus: 'none',
		error: null,
		user: null
	}
};

const reducer = createReducer(initialState, builder => {
	builder
		.addCase(loginStart, (state: IPitState, action) => {
			state.login.loadStatus = 'loading';
		})
		.addCase(loginSuccess, (state: IPitState, action) => {
			state.login.loadStatus = 'success';
			state.login.user = action.payload;
		})
		.addCase(loginFailed, (state: IPitState, action) => {
			state.login.loadStatus = 'failed';
			state.login.error = action.payload;
		})
		.addCase(logoutSuccess, (state: IPitState) => {
			state.login = initialState.login;
		});
});

export const store = configureStore({
	reducer: reducer
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IPitState> = useSelector;
