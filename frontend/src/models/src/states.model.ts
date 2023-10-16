import React from 'react';
import { Language } from './languages.model';
import {
	GlobalObjectiveStats,
	ImageInfo,
	Match,
	MatchResponse,
	ObjectiveDescriptor,
	Plan,
	Team
} from './response.model';
import { CommentsForEvent, DetailNote } from './display.model';

export type Statelet<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload',
	success = 'success',
}

export interface AppState {
	language: Language;
	login: LoginState;
	csv: {
		loadStatus: LoadStatus;
		url: string;
	};
	matches: {
		loadStatus: LoadStatus;
		raw: MatchResponse[];
		data: Match[];
		selectedMatch: Match;
	};
	teams: {
		loadStatus: LoadStatus;
		data: Team[];
		selectedTeam: Team;
	};
	stats: {
		loadStatus: LoadStatus;
		data: GlobalObjectiveStats[];
		selectedStat: ObjectiveDescriptor;
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
}

export interface LoginState {
	isLoggedIn: boolean;
	teamNumber: number;
	username: string;
	eventCode: string;
	secretCode: string;
}

export interface ImageState {
	[teamNumber: number]: {
		loadStatus: LoadStatus;
		info: ImageInfo;
		url: string;
	};
}

export interface InspectionState {
	loadStatus: LoadStatus;
	notes: DetailNote[];
	questionNames: string[];
	hiddenQuestionNames: string[];
}

export interface CommentState {
	loadStatus: LoadStatus;
	comments: CommentsForEvent;
	topics: string[];
}
