import { Match } from '../models/response.model';

export interface Action {
	type: Actions;
	payload?: any
}

export enum Actions {
	LOGIN = '[LOGIN] Login',
	GET_MATCHES_START = '[MATCH] Started getting matches',
	GET_MATCHES_SUCCESS = '[MATCH] Successfully got matches',
	SELECT_MATCH = '[MATCH] Select match',
	REPLACE_MATCH = '[MATCH] Replace match'
}

export const login = (
	teamNumber: string,
	eventCode: string,
	secretCode: string
): Action => ({
	type: Actions.LOGIN,
	payload: {
		teamNumber,
		eventCode,
		secretCode
	}
});

export const getMatchesStart = (): Action => ({
	type: Actions.GET_MATCHES_START
});

export const getMatchesSuccess = (matches: Match[]): Action => ({
	type: Actions.GET_MATCHES_SUCCESS,
	payload: matches
});

export const selectMatch = (match: Match): Action => ({
	type: Actions.SELECT_MATCH,
	payload: match
});

export const replaceMatch = (oldId: number, match: Match): Action => ({
	type: Actions.REPLACE_MATCH,
	payload: {
		oldId: oldId,
		match: match
	}
});
