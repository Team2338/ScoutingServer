import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Match, MatchResponse } from '../models/response.model';
import { AppState } from '../models/states.model';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	language: 'spanish',
	isLoggedIn: false,
	teamNumber: null,
	eventCode: null,
	secretCode: null,
	matches: {
		isLoaded: false,
		raw: [],
		data: [],
		selectedMatch: null
	},
	teams: {
		isLoaded: false,
		data: [],
		selectedTeam: null
	},
	stats: {
		isLoaded: false,
		data: [],
		selectedStat: null
	}
};

const reducer = function (state: AppState = INITIAL_STATE, action: Action) {
	switch (action.type) {
		case Actions.SELECT_LANG_SUCCESS:
			return {
				...state,
				language: action.payload
			};
		case Actions.LOGIN:
			return {
				...state,
				isLoggedIn: true,
				teamNumber: action.payload.teamNumber,
				eventCode: action.payload.eventCode,
				secretCode: action.payload.secretCode
			};
		case Actions.LOGOUT:
			return INITIAL_STATE;
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
					data: action.payload.matchModels,
					raw: action.payload.raw
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
			// If we're modifying data for the currently selected team, deselect it so that we don't
			// see old data when we revisit the Teams page.
			const selectedTeam = (action.payload.match.robotNumber === state.teams.selectedTeam?.id)
				? null
				: state.teams.selectedTeam;
			return {
				...state,
				matches: {
					...state.matches,
					data: replaceMatch(state.matches.data, action.payload.oldId, action.payload.match),
					raw: replaceRawMatch(state.matches.raw, action.payload.oldId, action.payload.rawMatch),
					selectedMatch: action.payload.match
				},
				teams: {
					...state.teams,
					isLoaded: false, // Mark data as dirty, since we modified it
					selectedTeam: selectedTeam
				},
				stats: {
					...state.stats,
					isLoaded: false, // Mark as dirty, since we modified it
					selectedStat: null // Guaranteed to have modified the data we were previously viewing, so hide it
				}
			};
		case Actions.CALCULATE_TEAM_STATS_START:
			return {
				...state,
				teams: {
					...state.teams,
					isLoaded: false
				}
			};
		case Actions.CALCULATE_TEAM_STATS_SUCCESS:
			return {
				...state,
				teams: {
					...state.teams,
					isLoaded: true,
					data: action.payload,
				}
			};
		case Actions.SELECT_TEAM:
			return {
				...state,
				teams: {
					...state.teams,
					selectedTeam: action.payload
				}
			};
		case Actions.CALCULATE_GLOBAL_STATS_START:
			return {
				...state,
				stats: {
					...state.stats,
					isLoaded: false
				}
			};
		case Actions.CALCULATE_GLOBAL_STATS_SUCCESS:
			return {
				...state,
				stats: {
					...state.stats,
					isLoaded: true,
					data: action.payload
				}
			};
		case Actions.SELECT_STAT:
			return {
				...state,
				stats: {
					...state.stats,
					selectedStat: {
						gamemode: action.payload.gamemode,
						objective: action.payload.objective
					}
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

function replaceRawMatch(matches: MatchResponse[], oldId: number, match: MatchResponse) {
	const targetIndex = matches.findIndex((match: MatchResponse) => match.id === oldId);
	const result = matches.slice();
	result[targetIndex] = match;

	return result;
}
