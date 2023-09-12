import React from 'react';
import { IForm } from './UiModels';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface IPitState {
	login: {
		loadStatus: LoadStatus;
		error: string;
		user: IUser;
		token: IToken;
	},
	upload: {
		loadStatus: LoadStatus;
		error: string;
	},
	forms: {
		loadStatus: LoadStatus;
		error: string;
		selected: number;
		robots: number[];
		data: {
			[robotNumber: number]: IForm
		}
	},
	snackbar: {
		message: string;
		severity: 'error' | 'warning' | 'info' | 'success';
		isOpen: boolean;
	}
}

export interface IUser {
	teamNumber: string;
	username: string;
	eventCode: string;
	secretCode: string;
}

export interface IToken {
	teamNumber: number;
	username: string;
	role: UserRoles;
}

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	success = 'success',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload'
}

export enum UserRoles {
	admin = 'admin',
	none = 'none'
}
