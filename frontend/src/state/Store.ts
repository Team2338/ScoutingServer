import { configureStore } from '@reduxjs/toolkit';
import { AppState, Language, Match, MatchResponse, RequestStatus } from '../models';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	language: Language.ENGLISH,
	isLoggedIn: false,
	teamNumber: null,
	username: null,
	eventCode: null,
	secretCode: null,
	csv: {
		loadStatus: RequestStatus.none,
		url: null
	},
	matches: {
		loadStatus: RequestStatus.none,
		raw: [],
		data: [],
		selectedMatch: null
	},
	teams: {
		loadStatus: RequestStatus.none,
		data: [],
		selectedTeam: null
	},
	stats: {
		loadStatus: RequestStatus.none,
		data: [],
		selectedStat: null
	},
	notes: {
		loadStatus: RequestStatus.none,
		data: []
	}
};

const reducer = function (state: AppState = INITIAL_STATE, action: Action): AppState {
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
				username: action.payload.username,
				eventCode: action.payload.eventCode,
				secretCode: action.payload.secretCode
			};
		case Actions.LOGOUT:
			return INITIAL_STATE;
		case Actions.GET_CSV_START:
			return {
				...state,
				csv: {
					loadStatus: RequestStatus.loading,
					url: null
				}
			};
		case Actions.GET_CSV_SUCCESS:
			return {
				...state,
				csv: {
					loadStatus: RequestStatus.success,
					url: action.payload
				}
			};
		case Actions.GET_ALL_NOTES_START:
			return {
				...state,
				notes: {
					...state.notes,
					loadStatus: getNextStatusOnLoad(state.notes.loadStatus)
				}
			};
		case Actions.GET_ALL_NOTES_SUCCESS:
			return {
				...state,
				notes: {
					...state.notes,
					loadStatus: RequestStatus.success,
					data: action.payload
				}
			};
		case Actions.ADD_NOTE_SUCCESS:
			return {
				...state,
				notes: {
					...state.notes,
					data: state.notes.data.concat(action.payload)
				}
			};
		case Actions.GET_MATCHES_START:
			return {
				...state,
				matches: {
					...state.matches,
					loadStatus: getNextStatusOnLoad(state.matches.loadStatus)
				}
			};
		case Actions.GET_MATCHES_SUCCESS:
			return {
				...state,
				matches: {
					loadStatus: RequestStatus.success,
					data: action.payload.matchModels,
					raw: action.payload.raw,
					selectedMatch: null
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
					loadStatus: getNextStatusOnLoad(state.teams.loadStatus)
				}
			};
		case Actions.CALCULATE_TEAM_STATS_SUCCESS:
			return {
				...state,
				teams: {
					...state.teams,
					loadStatus: RequestStatus.success,
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
					loadStatus: RequestStatus.loading
				}
			};
		case Actions.CALCULATE_GLOBAL_STATS_SUCCESS:
			return {
				...state,
				stats: {
					...state.stats,
					loadStatus: RequestStatus.success,
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

export const store = configureStore({
	reducer: reducer
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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

function getNextStatusOnLoad(previousStatus: RequestStatus): RequestStatus {
	if (previousStatus === RequestStatus.success || previousStatus === RequestStatus.loadingWithPriorSuccess) {
		return RequestStatus.loadingWithPriorSuccess;
	}

	return RequestStatus.loading;
}
