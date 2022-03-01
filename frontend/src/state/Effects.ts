import { Language } from '../models/languages.model';
import gearscoutService from '../service/GearscoutService';
import matchModelService from '../service/MatchModelService';
import { Match, MatchResponse, Team } from '../models/response.model';
import { AppState } from '../models/states.model';
import StatModelService from '../service/StatModelService';
import TeamModelService from '../service/TeamModelService';
import {
	calculateGlobalStatsStart,
	calculateGlobalStatsSuccess,
	calculateTeamStatsStart,
	calculateTeamStatsSuccess, getCsvStart, getCsvSuccess,
	getMatchesStart,
	getMatchesSuccess,
	loginSuccess,
	logoutSuccess,
	replaceMatch,
	selectLangSuccess
} from './Actions';

type GetState = () => AppState;

export const initApp = () => async (dispatch) => {
	const teamNumber: string = localStorage.getItem('teamNumber');
	const eventCode: string = localStorage.getItem('eventCode');
	const secretCode: string = localStorage.getItem('secretCode');

	// Only login if all information is present
	if (teamNumber && eventCode && secretCode) {
		dispatch(loginSuccess(Number(teamNumber), eventCode, secretCode));
	}

	const language: Language = localStorage.getItem('language') as Language;
	if (language) {
		dispatch(selectLangSuccess(language));
	}
};

export const selectLanguage = (language: Language) => async (dispatch) => {
	localStorage.setItem('language', language);
	dispatch(selectLangSuccess(language));
};

export const login = (
	teamNumber: number,
	eventCode: string,
	secretCode: string
) => async (dispatch) => {
	localStorage.setItem('teamNumber', teamNumber.toString());
	localStorage.setItem('eventCode', eventCode);
	localStorage.setItem('secretCode', secretCode);

	dispatch(loginSuccess(teamNumber, eventCode, secretCode));
};

export const logout = () => async (dispatch) => {
	localStorage.clear();

	dispatch(logoutSuccess());
};

export const getMatches = () => async (dispatch, getState: GetState) => {
	console.log('Getting matches');
	dispatch(getMatchesStart());
	dispatch(getCsvData());

	try {
		const response = await gearscoutService.getMatches(getState().teamNumber, getState().eventCode, getState().secretCode);
		const matchResponses: MatchResponse[] = response.data;
		const matches: Match[] = matchResponses.map((matchResponse: MatchResponse) => {
			return matchModelService.convertMatchResponseToModel(matchResponse);
		});

		dispatch(getMatchesSuccess(matches, matchResponses));
		dispatch(getTeams());
	} catch (error) {
		console.error('Error getting matches', error);
	}
};

export const getCsvData = () => async (dispatch, getState: GetState) => {
	console.log('Getting CSV');

	const lastUrl = getState().csv.url;
	dispatch(getCsvStart());

	try {
		let response = await gearscoutService.getMatchesAsCsv(getState().teamNumber, getState().eventCode, getState().secretCode);
		const csvContent = response.data;
		const csvBlob = new Blob([csvContent], { type: 'text/csv' });

		// Revoke last URL
		if (lastUrl) {
			window.URL.revokeObjectURL(lastUrl);
		}

		const nextUrl = window.URL.createObjectURL(csvBlob);
		dispatch(getCsvSuccess(nextUrl));
	} catch (error) {
		console.error('Error getting CSV', error);
	}
}

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	console.log('Hiding match');
	try {
		const response = await gearscoutService.hideMatch(getState().teamNumber, match.id, getState().secretCode);
		const rawMatch: MatchResponse = response.data;
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(rawMatch);

		dispatch(replaceMatch(match.id, updatedMatch, rawMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

export const unhideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	console.log('Unhiding match');
	try {
		const response = await gearscoutService.unhideMatch(getState().teamNumber, match.id, getState().secretCode);
		const rawMatch = response.data;
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(rawMatch);

		dispatch(replaceMatch(match.id, updatedMatch, rawMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

export const getTeams = () => async (dispatch, getState: GetState) => {
	console.log('Computing team statistics');
	dispatch(calculateTeamStatsStart());

	// Group matches by robot number
	const matches = getState().matches.raw.filter((match: MatchResponse) => !match.isHidden); // Filter out hidden matches
	const groupedMatches = new Map<number, MatchResponse[]>();
	for (const match of matches) {
		if (!groupedMatches.has(match.robotNumber)) {
			groupedMatches.set(match.robotNumber, []);
		}

		groupedMatches.get(match.robotNumber).push(match);
	}

	// Calculate team statistics
	const teams: Team[] = [];
	groupedMatches.forEach((robotMatches: MatchResponse[]) => {
		teams.push(TeamModelService.createTeam(robotMatches));
	});

	// Sort by team number, ascending
	teams.sort((a: Team, b: Team) => a.id - b.id);

	dispatch(calculateTeamStatsSuccess(teams));
	dispatch(getGlobalStats());
};

export const getGlobalStats = () => async (dispatch, getState: GetState) => {
	console.log('Computing global statistics');
	dispatch(calculateGlobalStatsStart());

	const teams = getState().teams.data;
	const globalStats = StatModelService.calculateGlobalStats(teams);
	dispatch(calculateGlobalStatsSuccess(globalStats));
};
