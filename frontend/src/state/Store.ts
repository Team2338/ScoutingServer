import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from '../models/states.model';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	eventCode: null,
	teamNumber: null,
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
		default:
			return state;
	}
};

export const store = createStore(reducer, applyMiddleware(thunk));
