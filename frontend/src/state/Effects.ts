import gearscoutService from '../api/GearscoutService';
import { Match } from '../models/response.model';
import { AppState } from '../models/states.model';
import { getMatchesStart, getMatchesSuccess } from './Actions';

type GetState = () => AppState;

export const getMatches = (eventCode: string) => async (dispatch, getState: GetState) => {
	console.log('Getting matches');

	try {
		dispatch(getMatchesStart());
		let response = await gearscoutService.getMatches(getState().teamNumber, eventCode);
		dispatch(getMatchesSuccess(response.data));
	} catch (error) {
		console.error('Error getting matches', error);
	}
}

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	try {
		const response = await gearscoutService.hideMatch(getState().teamNumber, match.id, getState().secretCode);
	} catch (error) {
		console.error('Error hiding match', error);
	}
}

export const unhideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	try {
		const response = await gearscoutService.unhideMatch(getState().teamNumber, match.id, getState().secretCode);
	} catch (error) {
		console.error('Error hiding match', error);
	}
}
