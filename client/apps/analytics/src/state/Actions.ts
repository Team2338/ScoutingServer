import {
	CommentsForEvent,
	Inspection,
	GlobalObjectiveStats,
	ImageInfo,
	Language,
	Match,
	MatchResponse,
	Team
} from '../models';
import {
	IEventInfo,
	ITokenModel,
	IUserInfo
} from '@gearscout/models';

export interface Action {
	type: Actions;
	payload?: any;
}

export enum Actions {
	SELECT_LANG_SUCCESS = '[LANG] Successfully selected language',
	LOGIN = '[AUTH] Login',
	LOGOUT = '[AUTH] Logout',
	LOGIN_AS_MEMBER_START = '[AUTH] Start login as member',
	LOGIN_AS_MEMBER_SUCCESS = '[AUTH] Successfully logged in as member',
	LOGIN_AS_MEMBER_FAIL = '[AUTH] Failed login as member',
	CREATE_USER_START = '[AUTH] Start creating user',
	CREATE_USER_SUCCESS = '[AUTH] Successfully created user',
	CREATE_USER_FAIL = '[AUTH] Failed to create user',
	GET_CSV_START = '[CSV] Start getting CSV',
	GET_CSV_SUCCESS = '[CSV] Successfully got CSV',
	GET_EVENTS_START = '[EVENT] Start getting events',
	GET_EVENTS_SUCCESS = '[EVENT] Successfully got events',
	GET_EVENTS_FAIL = '[EVENT] Failed to get events',
	SELECT_EVENT_SUCCESS = '[EVENT] Successfully selected event',
	GET_MATCHES_START = '[MATCH] Started getting matches',
	GET_MATCHES_SUCCESS = '[MATCH] Successfully got matches',
	GET_MATCHES_FAIL = '[MATCH] Failed to get matches',
	SELECT_MATCH = '[MATCH] Select match',
	REPLACE_MATCH = '[MATCH] Replace match',
	CALCULATE_TEAM_STATS_START = '[TEAM] Started calculating team stats',
	CALCULATE_TEAM_STATS_SUCCESS = '[TEAM] Successfully calculated team stats',
	SELECT_TEAM = '[TEAM] Select team',
	CALCULATE_GLOBAL_STATS_START = '[STATS] Started calculating global stats',
	CALCULATE_GLOBAL_STATS_SUCCESS = '[STATS] Successfully calculated global stats',
	SELECT_STAT = '[STATS] Select stat',
	ADD_SELECTED_STAT = '[STATS] Add selection',
	REMOVE_SELECTED_STAT = '[STATS] Remove selection',
	CLEAR_SELECTED_STATS = '[STATS] Clear selection',
	SELECT_FIRST_TEAM_FOR_PLANNING = '[PLAN] Select first team',
	SELECT_SECOND_TEAM_FOR_PLANNING = '[PLAN] Select second team',
	SELECT_THIRD_TEAM_FOR_PLANNING = '[PLAN] Select third team',
	APPLY_PLAN_SELECTION = '[PLAN] Apply selection',
	CLEAR_PLAN = '[PLAN] Clear',
	GET_EVENT_IMAGE_INFO_START = '[IMAGE] Start getting event info',
	GET_EVENT_IMAGE_INFO_SUCCESS = '[IMAGE] Successfully got event info',
	GET_EVENT_IMAGE_INFO_FAIL = '[IMAGE] Failed to get event info',
	GET_INSPECTIONS_START = '[INSPECTION] Start getting inspections',
	GET_INSPECTIONS_SUCCESS = '[INSPECTION] Successfully got inspections',
	GET_INSPECTIONS_FAIL = '[INSPECTION] Failed to get inspections',
	HIDE_INSPECTION_COLUMN = '[INSPECTION] Hide column',
	SHOW_INSPECTION_COLUMN = '[INSPECTION] Show column',
	SET_HIDDEN_INSPECTION_COLUMNS_START = '[INSPECTION] Set hidden columns',
	GET_ALL_COMMENTS_START = '[COMMENTS] Start getting all comments',
	GET_ALL_COMMENTS_SUCCESS = '[COMMENTS] Successfully got all comments',
	GET_ALL_COMMENTS_FAIL = '[COMMENTS] Failed to get comments'
}

export const selectLangSuccess = (language: Language): Action => ({
	type: Actions.SELECT_LANG_SUCCESS,
	payload: language
});

export const loginSuccess = (data: {
	teamNumber: number;
	gameYear: number;
	username: string;
	eventCode: string;
	secretCode: string;
}): Action => ({
	type: Actions.LOGIN,
	payload: data
});

export const logoutSuccess = (): Action => ({
	type: Actions.LOGOUT
});

export const loginAsMemberStart = (): Action => ({
	type: Actions.LOGIN_AS_MEMBER_START
});

export const loginAsMemberSuccess = (user: IUserInfo, tokenString: string, token: ITokenModel): Action => ({
	type: Actions.LOGIN_AS_MEMBER_SUCCESS,
	payload: {
		user: user,
		tokenString: tokenString,
		token: token
	}
});

export const loginAsMemberFail = (message: string): Action => ({
	type: Actions.LOGIN_AS_MEMBER_FAIL,
	payload: message
});

export const createUserStart = (): Action => ({
	type: Actions.CREATE_USER_START
});

export const createUserSuccess = (user: IUserInfo, tokenString: string, token: ITokenModel): Action => ({
	type: Actions.CREATE_USER_SUCCESS,
	payload: {
		user: user,
		tokenString: tokenString,
		token: token
	}
});

export const createUserFail = (message: string): Action => ({
	type: Actions.CREATE_USER_FAIL,
	payload: message
});

export const getCsvStart = (): Action => ({
	type: Actions.GET_CSV_START,
});

export const getCsvSuccess = (url: string): Action => ({
	type: Actions.GET_CSV_SUCCESS,
	payload: url
});

export const getEventsStart = (): Action => ({
	type: Actions.GET_EVENTS_START
});

export const getEventsSuccess = (events: IEventInfo[]): Action => ({
	type: Actions.GET_EVENTS_SUCCESS,
	payload: events
});

export const getEventsFail = (message: string): Action => ({
	type: Actions.GET_EVENTS_FAIL,
	payload: message
});

export const selectEventSuccess = (event: IEventInfo): Action => ({
	type: Actions.SELECT_EVENT_SUCCESS,
	payload: event
});

export const getMatchesStart = (): Action => ({
	type: Actions.GET_MATCHES_START
});

export const getMatchesSuccess = (matches: Match[], raw: MatchResponse[]): Action => ({
	type: Actions.GET_MATCHES_SUCCESS,
	payload: {
		matchModels: matches,
		raw: raw
	}
});

export const getMatchesFail = (): Action => ({
	type: Actions.GET_MATCHES_FAIL,
});

export const selectMatch = (match: Match): Action => ({
	type: Actions.SELECT_MATCH,
	payload: match
});

export const replaceMatch = (oldId: number, match: Match, rawMatch: MatchResponse): Action => ({
	type: Actions.REPLACE_MATCH,
	payload: {
		oldId: oldId,
		match: match,
		rawMatch: rawMatch
	}
});

export const calculateTeamStatsStart = (): Action => ({
	type: Actions.CALCULATE_TEAM_STATS_START
});

export const calculateTeamStatsSuccess = (teams: Team[]): Action => ({
	type: Actions.CALCULATE_TEAM_STATS_SUCCESS,
	payload: teams
});

export const selectTeam = (teamNumber: number): Action => ({
	type: Actions.SELECT_TEAM,
	payload: teamNumber
});

export const calculateGlobalStatsStart = (): Action => ({
	type: Actions.CALCULATE_GLOBAL_STATS_START
});

export const calculateGlobalStatsSuccess = (stats: GlobalObjectiveStats[]): Action => ({
	type: Actions.CALCULATE_GLOBAL_STATS_SUCCESS,
	payload: stats
});

export const selectStat = (gamemode: string, objective: string): Action => ({
	type: Actions.SELECT_STAT,
	payload: {
		gamemode: gamemode,
		objective: objective
	}
});

export const addSelectedStat = (gamemode: string, objective: string): Action => ({
	type: Actions.ADD_SELECTED_STAT,
	payload: {
		gamemode: gamemode,
		objective: objective
	}
});

export const removeSelectedStat = (gamemode: string, objective: string): Action => ({
	type: Actions.REMOVE_SELECTED_STAT,
	payload: {
		gamemode: gamemode,
		objective: objective
	}
});

export const clearSelectedStats = (): Action => ({
	type: Actions.CLEAR_SELECTED_STATS
});

export const selectFirstTeamForPlanning = (team: Team): Action => ({
	type: Actions.SELECT_FIRST_TEAM_FOR_PLANNING,
	payload: team
});

export const selectSecondTeamForPlanning = (team: Team): Action => ({
	type: Actions.SELECT_SECOND_TEAM_FOR_PLANNING,
	payload: team
});

export const selectThirdTeamForPlanning = (team: Team): Action => ({
	type: Actions.SELECT_THIRD_TEAM_FOR_PLANNING,
	payload: team
});

export const applyPlanSelection = (firstTeam: Team, secondTeam: Team, thirdTeam: Team): Action => ({
	type: Actions.APPLY_PLAN_SELECTION,
	payload: {
		firstTeam: firstTeam,
		secondTeam: secondTeam,
		thirdTeam: thirdTeam
	}
});

export const clearPlan = (): Action => ({
	type: Actions.CLEAR_PLAN
});

export const getEventImageInfoStart = (): Action => ({
	type: Actions.GET_EVENT_IMAGE_INFO_START
});

export const getEventImageInfoSuccess = (info: ImageInfo[]): Action => ({
	type: Actions.GET_EVENT_IMAGE_INFO_SUCCESS,
	payload: info
});

export const getEventImageInfoFail = (): Action => ({
	type: Actions.GET_EVENT_IMAGE_INFO_FAIL
});

export const getInspectionsStart = (): Action => ({
	type: Actions.GET_INSPECTIONS_START
});

export const getInspectionsSuccess = (notes: Inspection[], questionNames: string[]): Action => ({
	type: Actions.GET_INSPECTIONS_SUCCESS,
	payload: {
		notes,
		questionNames
	}
});

export const getInspectionsFail = (): Action => ({
	type: Actions.GET_INSPECTIONS_FAIL
});

export const hideInspectionColumnStart = (column: string): Action => ({
	type: Actions.HIDE_INSPECTION_COLUMN,
	payload: column
});

export const showInspectionColumnStart = (column: string): Action => ({
	type: Actions.SHOW_INSPECTION_COLUMN,
	payload: column
});

export const setHiddenInspectionColumnsStart = (columns: string[]): Action => ({
	type: Actions.SET_HIDDEN_INSPECTION_COLUMNS_START,
	payload: columns
});

export const getCommentsStart = (): Action => ({
	type: Actions.GET_ALL_COMMENTS_START
});

export const getCommentsSuccess = (comments: CommentsForEvent, topics: string[]): Action => ({
	type: Actions.GET_ALL_COMMENTS_SUCCESS,
	payload: {
		comments: comments,
		topics: topics
	}
});

export const getCommentsFail = (): Action => ({
	type: Actions.GET_ALL_COMMENTS_FAIL
});
