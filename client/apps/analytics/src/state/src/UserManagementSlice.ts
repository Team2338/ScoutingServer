import { IUserInfo, LoadStatus } from '@gearscout/models';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { IUserManagementState } from '../../models';
import { getNextStatusOnFail, getNextStatusOnLoad } from './Utility';

const initialState: IUserManagementState = {
	loadStatus: LoadStatus.none,
	users: []
};

export const getUsersStart = createAction('users/get-start');
export const getUsersSuccess = createAction<IUserInfo[]>('users/get-success');
export const getUsersFail = createAction('users/get-failed');

export const userManagementSlice = createReducer(initialState, builder => {
	builder
		.addCase(getUsersStart, (state: IUserManagementState) => {
			state.loadStatus = getNextStatusOnLoad(state.loadStatus);
		})
		.addCase(getUsersSuccess, (state: IUserManagementState, action) => {
			state.loadStatus = LoadStatus.success;
			state.users = action.payload;
		})
		.addCase(getUsersFail, (state: IUserManagementState) => {
			state.loadStatus = getNextStatusOnFail(state.loadStatus);
		})
	;
});
