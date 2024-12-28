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

export type TGameYear = number;
export interface IPitState {
	loginv2: ILoginState;
	events: IEventState;
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

interface ILoginState {
	loginStatus: LoginStatus;
	error: string;
	role: UserRole;
	token: ITokenModel;
	tokenString: string;
	user: IUserInfo;
}

interface IEventState {
	loadStatus: LoadStatus;
	error: string;
	list: IEventInfo[];
	byYear: Record<TGameYear, IEventInfo[]>;
	years: TGameYear[];
	selectedEvent: IEventInfo;
}
