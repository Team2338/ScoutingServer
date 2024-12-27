import React from 'react';
import { IForm } from './UiModels';
import {
	IEventInfo,
	ITokenModel,
	IUserInfo,
	LoadStatus,
	LoginStatus,
	UserRole
} from '@gearscout/models';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface IPitState {
	loginv2: ILoginState;
	events: {
		loadStatus: LoadStatus;
		error: string;
		list: IEventInfo[];
		selectedEvent: IEventInfo;
	};
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
