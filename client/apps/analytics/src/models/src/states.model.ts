import React from 'react';
import {
	GlobalObjectiveStats,
	Match,
	MatchResponse,
	ObjectiveDescriptor,
	Plan,
	Team
} from './response.model';
import { CommentsForEvent, Inspection } from './display.model';
import {
	IEventState,
	ITokenModel,
	IUserInfo,
	Language,
	LoadStatus,
	LoginErrors,
	UserRole
} from '@gearscout/models';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export enum LoginPageVariant { // TODO: Use URL instead
	guestPage = 'guestPage',
	loginPage = 'loginPage',
	createUserPage = 'createUserPage',
}

export enum LoginStatus {
	none = 'none',
	guest = 'guest',
	loggedIn = 'loggedIn',
	loggingIn = 'loggingIn',
	logInFailed = 'logInFailed',
}

export interface AppState {
	language: Language;
	loginV2: LoginV2State;
	csv: {
		loadStatus: LoadStatus;
		url: string;
	};
	events: IEventState,
	matches: {
		lastUpdated: string;
		loadStatus: LoadStatus;
		raw: MatchResponse[];
		data: Match[];
		selectedMatch: Match;
	};
	teams: {
		loadStatus: LoadStatus;
		data: Team[];
		selectedTeam: number;
	};
	stats: {
		loadStatus: LoadStatus;
		data: GlobalObjectiveStats[];
		selectedStats: ObjectiveDescriptor[];
	};
	planning: {
		loadStatus: LoadStatus;
		firstTeam: Team;
		secondTeam: Team;
		thirdTeam: Team;
		plan: Plan;
	};
	images: ImageState;
	inspections: InspectionState;
	comments: CommentState;
	userManagement: IUserManagementState;
}

export interface LoginV2State {
	loginStatus: LoginStatus;
	error: LoginErrors;
	role: UserRole;
	token: ITokenModel;
	tokenString: string;
	user: IUserInfo;
}

export interface ImageState {
	loadStatus: LoadStatus;
	images: {
		[teamNumber: number]: {
			creator: string;
			url: string;
			timeCreated: string;
		}
	}
}

export interface InspectionState {
	loadStatus: LoadStatus;
	inspections: Inspection[];
	questionNames: string[];
	hiddenQuestionNames: string[];
}

export interface CommentState {
	loadStatus: LoadStatus;
	comments: CommentsForEvent;
	topics: string[];
}

export interface IUserManagementState {
	loadStatus: LoadStatus;
	users: IUserInfo[];
}
