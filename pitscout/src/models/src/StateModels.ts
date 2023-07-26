import React from 'react';

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
		selected: IForm;
		robots: number[];
		data: {
			[robotNumber: number]: IForm
		}
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
	success = 'success',
	failed = 'failed'
}

export enum UserRoles {
	admin = 'admin',
	none = 'none'
}

export interface IForm {
	loadStatus: LoadStatus;
	error: string;
	robotNumber: number;
	questions: IFormQuestion[];
}

export interface IFormQuestion {
	question: string;
	answer: string;
}
