import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export interface IPitState {
	loadStatus: 'none' | 'loading' | 'success' | 'failed';
}

export const loginStart = createAction('login/start');
export const loginSuccess = createAction('login/success');
export const loginFailed = createAction('login/failed');

const initialState: IPitState = {
	loadStatus: 'none'
};

const reducer = createReducer(initialState, builder => {
	builder
		.addCase(loginStart, (state: IPitState, action) => {
			state.loadStatus = 'loading';
		})
		.addCase(loginSuccess, (state: IPitState, action) => {
			state.loadStatus = 'success';
		})
		.addCase(loginFailed, (state: IPitState, action) => {
			state.loadStatus = 'failed';
		});
});

export const store = configureStore({
	reducer: reducer
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IPitState> = useSelector;
