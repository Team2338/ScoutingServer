import React from 'react';
import { IForm } from './UiModels';
import {IEventInfo, IUserInfo} from './ResponseModels';
import { ITokenModel, UserRoles } from './AuthModels';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface IPitState {
	loginv2: ILoginState;
	selectedEvent: IEventInfo;
	upload: {
		loadStatus: LoadStatus;
		error: string;
	};
	forms: {
		loadStatus: LoadStatus;
		error: string;
		selected: number;
		robots: number[];
		data: {
			[robotNumber: number]: IForm
		}
	};
	snackbar: {
		message: string;
		severity: 'error' | 'warning' | 'info' | 'success';
		isOpen: boolean;
	};
}

export interface ILoginState {
	loginStatus: LoginStatus;
	error: string;
	role: UserRoles;
	token: ITokenModel;
	tokenString: string;
	user: IUserInfo;
	selectedEvent: IEventInfo;
}

export interface IUser {
	teamNumber: string;
	username: string;
	eventCode: string;
	secretCode: string;
}

export enum LoginStatus {
	none = 'none',
	loggedIn = 'loggedIn',
	loggingIn = 'loggingIn',
	logInFailed = 'logInFailed'
}

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	success = 'success',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload'
}
