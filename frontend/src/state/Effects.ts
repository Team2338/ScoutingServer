import gearscoutService from '../service/GearscoutService';
import matchModelService from '../service/MatchModelService';
import { Match, MatchResponse, Team } from '../models/response.model';
import { AppState } from '../models/states.model';
import StatModelService from '../service/StatModelService';
import TeamModelService from '../service/TeamModelService';
import TranslateService from '../service/TranslateService';
import {
	calculateGlobalStatsStart, calculateGlobalStatsSuccess,
	calculateTeamStatsStart,
	calculateTeamStatsSuccess,
	getMatchesStart,
	getMatchesSuccess,
	loginSuccess,
	logoutSuccess,
	replaceMatch
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

	await TranslateService.setLanguage('english');
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

	try {
		let response = await gearscoutService.getMatches(getState().teamNumber, getState().eventCode, getState().secretCode);
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

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	console.log('Hiding match');
	try {
		const response = await gearscoutService.hideMatch(getState().teamNumber, match.id, getState().secretCode);
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(response.data);

		dispatch(replaceMatch(match.id, updatedMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

export const unhideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	console.log('Unhiding match');
	try {
		const response = await gearscoutService.unhideMatch(getState().teamNumber, match.id, getState().secretCode);
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(response.data);

		dispatch(replaceMatch(match.id, updatedMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

export const getTeams = () => async (dispatch, getState: GetState) => {
	console.log('Computing team statistics');
	dispatch(calculateTeamStatsStart());

	// Group matches by robot number
	const matches = getState().matches.raw;
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
