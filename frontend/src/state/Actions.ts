import { Match } from '../models/response.model';

export interface Action {
	type: Actions;
	payload?: any
}

export enum Actions {
	GET_MATCHES_START = '[MATCH] Started getting matches',
	GET_MATCHES_SUCCESS = '[MATCH] Successfully got matches'
}


export const getMatchesStart = (): Action => ({
	type: Actions.GET_MATCHES_START
});

export const getMatchesSuccess = (matches: Match[]): Action => ({
	type: Actions.GET_MATCHES_SUCCESS,
	payload: matches
});
