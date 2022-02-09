import gearscoutService from '../service/GearscoutService';
import matchModelService from '../service/MatchModelService';
import { Match, MatchResponse } from '../models/response.model';
import { AppState } from '../models/states.model';
import TranslateService from '../service/TranslateService';
import { getMatchesStart, getMatchesSuccess, replaceMatch } from './Actions';

type GetState = () => AppState;

export const initApp = () => async () => {
	await TranslateService.setLanguage('english');
	console.log(TranslateService.translate('HELLO_WORLD'));
}

export const getMatches = () => async (dispatch, getState: GetState) => {
	console.log('Getting matches');

	try {
		dispatch(getMatchesStart());
		let response = await gearscoutService.getMatches(getState().teamNumber, getState().eventCode, getState().secretCode);
		const matches: Match[] = response.data.map((matchResponse: MatchResponse) => {
			return matchModelService.convertMatchResponseToModel(matchResponse);
		})
		dispatch(getMatchesSuccess(matches));
	} catch (error) {
		console.error('Error getting matches', error);
	}
}

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	try {
		const response = await gearscoutService.hideMatch(getState().teamNumber, match.id, getState().secretCode);
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(response.data);
		dispatch(replaceMatch(match.id, updatedMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
}

export const unhideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	try {
		const response = await gearscoutService.unhideMatch(getState().teamNumber, match.id, getState().secretCode);
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(response.data);
		dispatch(replaceMatch(match.id, updatedMatch));
	} catch (error) {
		console.error('Error hiding match', error);
	}
}
