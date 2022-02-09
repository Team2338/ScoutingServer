import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Match } from '../models/response.model';
import { AppState } from '../models/states.model';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	eventCode: 'test',
	teamNumber: 9999,
	secretCode: 'password',
	matches: {
		isLoaded: false,
		data: [],
		selectedMatch: null
	}
};

const reducer = function (state: AppState = INITIAL_STATE, action: Action) {
	switch (action.type) {
		case Actions.GET_MATCHES_START:
			return {
				...state,
				matches: {
					...state.matches,
					isLoaded: false
				}
			};
		case Actions.GET_MATCHES_SUCCESS:
			return {
				...state,
				matches: {
					isLoaded: true,
					data: action.payload
				}
			};
		case Actions.SELECT_MATCH:
			return {
				...state,
				matches: {
					...state.matches,
					selectedMatch: action.payload
				}
			};
		case Actions.REPLACE_MATCH:
			return {
				...state,
				matches: {
					...state.matches,
					data: replaceMatch(state.matches.data, action.payload.oldId, action.payload.match),
					selectedMatch: action.payload.match
				}
			};
		default:
			return state;
	}
};

export const store = createStore(reducer, applyMiddleware(thunk));

function replaceMatch(matches: Match[], oldId: number, match: Match) {
	const targetIndex = matches.findIndex((match: Match) => match.id === oldId);
	const result = matches.slice();
	result[targetIndex] = match;

	return result;
}
