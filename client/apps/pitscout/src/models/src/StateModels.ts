import React from 'react';
import { IForm } from './UiModels';
import {IEventInfo, IUserInfo} from './ResponseModels';
import { ITokenModel, UserRole } from '@gearscout/models';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface IPitState {
	loginv2: ILoginState;
	events: {
		loadStatus: LoadStatus;
		error: string;
		list: IEventInfo[];
		selectedEvent: IEventInfo;
	};
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
	role: UserRole;
	token: ITokenModel;
	tokenString: string;
	user: IUserInfo;
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
