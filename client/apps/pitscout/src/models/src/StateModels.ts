import React from 'react';
import {
	IForm,
} from './UiModels';
import {
	IEventState,
	ILoginState,
	LoadStatus
} from '@gearscout/models';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface IPitState {
	serviceWorker: {
		updated: boolean;
		sw: ServiceWorker | null;
	};
	login: ILoginState;
	events: IEventState;
	upload: IImageUploadState;
	forms: IFormsState;
	snackbar: ISnackbarState;
}

export interface IImageUploadState {
	loadStatus: LoadStatus;
	error: string;
}

export interface IFormsState {
	loadStatus: LoadStatus;
	error: string;
	selected: number;
	robots: number[];
	data: {
		[robotNumber: number]: IForm
	};
	offline: IForm[];
}

export interface ISnackbarState {
	message: string;
	severity: 'error' | 'warning' | 'info' | 'success';
	isOpen: boolean;
}
