import {
	GlobalObjectiveStats,
	Language,
	Match,
	MatchResponse,
	Note,
	Team
} from '../models';

export interface Action {
	type: Actions;
	payload?: any
}

export enum Actions {
	SELECT_LANG_SUCCESS = '[LANG] Successfully selected language',
	LOGIN = '[AUTH] Login',
	LOGOUT = '[AUTH] Logout',
	GET_CSV_START = '[CSV] Start getting CSV',
	GET_CSV_SUCCESS = '[CSV] Successfully got CSV',
	GET_MATCHES_START = '[MATCH] Started getting matches',
	GET_MATCHES_SUCCESS = '[MATCH] Successfully got matches',
	SELECT_MATCH = '[MATCH] Select match',
	REPLACE_MATCH = '[MATCH] Replace match',
	CALCULATE_TEAM_STATS_START = '[TEAM] Started calculating team stats',
	CALCULATE_TEAM_STATS_SUCCESS = '[TEAM] Successfully calculated team stats',
	SELECT_TEAM = '[TEAM] Select team',
	CALCULATE_GLOBAL_STATS_START = '[STATS] Started calculating global stats',
	CALCULATE_GLOBAL_STATS_SUCCESS = '[STATS] Successfully calculated global stats',
	SELECT_STAT = '[STATS] Select stat',
	GET_NOTES_FOR_ROBOT_START = '[NOTES] Start getting notes for robot',
	GET_NOTES_FOR_ROBOT_SUCCESS = '[NOTES] Successfully got notes for robot',
	GET_ALL_NOTES_START = '[NOTES] Start getting all notes',
	GET_ALL_NOTES_SUCCESS = '[NOTES] Successfully got all notes',
	ADD_NOTE_START = '[NOTES] Create new note',
	ADD_NOTE_SUCCESS = '[NOTES] Successfully created new note',
	SELECT_FIRST_TEAM_FOR_PLANNING = '[PLAN] Select first team',
	SELECT_SECOND_TEAM_FOR_PLANNING = '[PLAN] Select second team',
	SELECT_THIRD_TEAM_FOR_PLANNING = '[PLAN] Select third team',
	APPLY_PLAN_SELECTION = '[PLAN] Apply selection'
}

export const selectLangSuccess = (language: Language): Action => ({
	type: Actions.SELECT_LANG_SUCCESS,
	payload: language
});

export const loginSuccess = (
	teamNumber: number,
	username: string,
	eventCode: string,
	secretCode: string
): Action => ({
	type: Actions.LOGIN,
	payload: {
		teamNumber,
		username,
		eventCode,
		secretCode
	}
});

export const logoutSuccess = (): Action => ({
	type: Actions.LOGOUT
});

export const getCsvStart = (): Action => ({
	type: Actions.GET_CSV_START,
});

export const getCsvSuccess = (url: string): Action => ({
	type: Actions.GET_CSV_SUCCESS,
	payload: url
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

export const selectTeam = (team: Team): Action => ({
	type: Actions.SELECT_TEAM,
	payload: team
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

export const getNotesForRobotStart = (robotNumber: number): Action => ({
	type: Actions.GET_NOTES_FOR_ROBOT_START,
	payload: robotNumber
});

export const getNotesForRobotSuccess = (notes: Note[]): Action => ({
	type: Actions.GET_NOTES_FOR_ROBOT_SUCCESS,
	payload: notes
});

export const getAllNotesStart = (): Action => ({
	type: Actions.GET_ALL_NOTES_START
});

export const getAllNotesSuccess = (notes: Note[]): Action => ({
	type: Actions.GET_ALL_NOTES_SUCCESS,
	payload: notes
});

export const addNoteStart = (): Action => ({
	type: Actions.ADD_NOTE_START,
});

export const addNoteSuccess = (note: Note): Action => ({
	type: Actions.ADD_NOTE_SUCCESS,
	payload: note
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
