import { configureStore } from '@reduxjs/toolkit';
import {
	AppState,
	ImageInfo,
	ImageState,
	Language,
	LoadStatus,
	LoginStatus,
	Match,
	MatchResponse,
	UserRole
} from '../models';
import planningService from '../service/PlanningService';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	language: Language.ENGLISH,
	loginV2: {
		loginStatus: LoginStatus.none,
		role: null,
		tokenString: null,
		token: null,
		user: null,
		selectedEvent: null
	},
	csv: {
		loadStatus: LoadStatus.none,
		url: null
	},
	events: {
		loadStatus: LoadStatus.none,
		events: []
	},
	matches: {
		loadStatus: LoadStatus.none,
		raw: [],
		data: [],
		selectedMatch: null
	},
	teams: {
		loadStatus: LoadStatus.none,
		data: [],
		selectedTeam: null
	},
	stats: {
		loadStatus: LoadStatus.none,
		data: [],
		selectedStats: []
	},
	planning: {
		loadStatus: LoadStatus.none,
		firstTeam: null,
		secondTeam: null,
		thirdTeam: null,
		plan: null
	},
	images: {
		loadStatus: LoadStatus.none,
		images: {}
	},
	inspections: {
		loadStatus: LoadStatus.none,
		inspections: [],
		questionNames: [],
		hiddenQuestionNames: []
	},
	comments: {
		loadStatus: LoadStatus.none,
		comments: {},
		topics: []
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
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.guest,
					role: UserRole.guest,
					user: {
						id: null,
						email: null,
						teamNumber: action.payload.teamNumber,
						username: action.payload.username,
						role: UserRole.guest,
					},
					selectedEvent: {
						teamNumber: action.payload.teamNumber,
						gameYear: action.payload.gameYear,
						eventCode: action.payload.eventCode,
						secretCode: action.payload.secretCode,
						matchCount: null
					}
				}
			};
		case Actions.LOGOUT:
			return {
				...INITIAL_STATE,
				language: state.language
			};
		case Actions.LOGIN_AS_MEMBER_START:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.loggingIn
				}
			};
		case Actions.LOGIN_AS_MEMBER_SUCCESS:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.loggedIn,
					role: action.payload.token.role,
					user: action.payload.user,
					tokenString: action.payload.tokenString,
					token: action.payload.token,
				}
			};
		case Actions.LOGIN_AS_MEMBER_FAIL:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.logInFailed
				}
			};
		case Actions.CREATE_USER_START:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.loggingIn
				}
			};
		case Actions.CREATE_USER_SUCCESS:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.loggedIn,
					role: action.payload.token.role,
					tokenString: action.payload.tokenString,
					token: action.payload.token
				}
			};
		case Actions.CREATE_USER_FAIL:
			return {
				...state,
				loginV2: {
					...state.loginV2,
					loginStatus: LoginStatus.logInFailed,
				}
			};
		case Actions.GET_CSV_START:
			return {
				...state,
				csv: {
					loadStatus: LoadStatus.loading,
					url: null
				}
			};
		case Actions.GET_CSV_SUCCESS:
			return {
				...state,
				csv: {
					loadStatus: LoadStatus.success,
					url: action.payload
				}
			};
		case Actions.GET_EVENTS_START:
			return {
				...state,
				events: {
					...state.events,
					loadStatus: getNextStatusOnLoad(state.events.loadStatus)
				}
			};
		case Actions.GET_EVENTS_SUCCESS:
			return {
				...state,
				events: {
					...state.events,
					loadStatus: LoadStatus.success,
					events: action.payload
				}
			};
		case Actions.GET_EVENTS_FAIL:
			return {
				...state,
				events: {
					...state.events,
					loadStatus: getNextStatusOnFail(state.events.loadStatus)
				}
			};
		case Actions.SELECT_EVENT:
			if (action.payload === state.loginV2.selectedEvent) { // TODO: compare IDs once available
				return state;
			}

			return {
				...INITIAL_STATE,
				language: state.language,
				loginV2: {
					...state.loginV2,
					selectedEvent: action.payload
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
					loadStatus: LoadStatus.success,
					data: action.payload.matchModels,
					raw: action.payload.raw,
					selectedMatch: null
				}
			};
		case Actions.GET_MATCHES_FAIL:
			return {
				...state,
				matches: {
					...state.matches,
					loadStatus: getNextStatusOnFail(state.matches.loadStatus)
				},
				teams: {
					...state.teams,
					loadStatus: getNextStatusOnFail(state.teams.loadStatus)
				},
				stats: {
					...state.stats,
					loadStatus: getNextStatusOnFail(state.stats.loadStatus)
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
					raw: replaceRawMatch(state.matches.raw, action.payload.oldId, action.payload.rawMatch),
					selectedMatch: action.payload.match
				},
				teams: {
					...state.teams,
					loadStatus: LoadStatus.none, // Mark data as dirty, since we modified it
					// If we're modifying data for the currently selected team, deselect it so that we don't
					// see old data when we revisit the Teams page.
					selectedTeam: (action.payload.match.robotNumber === state.teams.selectedTeam)
						? null
						: state.teams.selectedTeam
				},
				stats: {
					...state.stats,
					loadStatus: LoadStatus.none, // Mark as dirty, since we modified it
					selectedStats: [] // Guaranteed to have modified the data we were previously viewing, so hide it
				},
				planning: INITIAL_STATE.planning
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
					loadStatus: LoadStatus.success,
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
					loadStatus: LoadStatus.loading
				}
			};
		case Actions.CALCULATE_GLOBAL_STATS_SUCCESS:
			return {
				...state,
				stats: {
					...state.stats,
					loadStatus: LoadStatus.success,
					data: action.payload
				}
			};
		case Actions.SELECT_STAT:
			return {
				...state,
				stats: {
					...state.stats,
					selectedStats: [action.payload]
				}
			};
		case Actions.ADD_SELECTED_STAT:
			return {
				...state,
				stats: {
					...state.stats,
					selectedStats: state.stats.selectedStats.concat(action.payload)
				}
			};
		case Actions.REMOVE_SELECTED_STAT:
			return {
				...state,
				stats: {
					...state.stats,
					selectedStats: state.stats.selectedStats.filter((descriptor) => (
						!(descriptor.gamemode === action.payload.gamemode && descriptor.objective === action.payload.objective)
					))
				}
			};
		case Actions.CLEAR_SELECTED_STATS:
			return {
				...state,
				stats: {
					...state.stats,
					selectedStats: []
				}
			};
		case Actions.SELECT_FIRST_TEAM_FOR_PLANNING:
			return {
				...state,
				planning: {
					...state.planning,
					firstTeam: action.payload
				}
			};
		case Actions.SELECT_SECOND_TEAM_FOR_PLANNING:
			return {
				...state,
				planning: {
					...state.planning,
					secondTeam: action.payload
				}
			};
		case Actions.SELECT_THIRD_TEAM_FOR_PLANNING:
			return {
				...state,
				planning: {
					...state.planning,
					thirdTeam: action.payload
				}
			};
		case Actions.APPLY_PLAN_SELECTION:
			return {
				...state,
				planning: {
					...state.planning,
					loadStatus: LoadStatus.success,
					firstTeam: action.payload.firstTeam,
					secondTeam: action.payload.secondTeam,
					thirdTeam: action.payload.thirdTeam,
					plan: planningService.createPlan(
						action.payload.firstTeam,
						action.payload.secondTeam,
						action.payload.thirdTeam
					)
				}
			};
		case Actions.CLEAR_PLAN:
			return {
				...state,
				planning: INITIAL_STATE.planning
			};
		case Actions.GET_EVENT_IMAGE_INFO_START:
			return {
				...state,
				images: {
					...state.images,
					loadStatus: getNextStatusOnLoad(state.images.loadStatus)
				}
			};
		case Actions.GET_EVENT_IMAGE_INFO_FAIL:
			return {
				...state,
				images: {
					...state.images,
					loadStatus: getNextStatusOnFail(state.images.loadStatus)
				}
			};
		case Actions.GET_EVENT_IMAGE_INFO_SUCCESS:
			return {
				...state,
				images: createImageStateFromInfo(action.payload)
			};
		case Actions.GET_INSPECTIONS_START:
			return {
				...state,
				inspections: {
					...state.inspections,
					loadStatus: getNextStatusOnLoad(state.inspections.loadStatus)
				}
			};
		case Actions.GET_INSPECTIONS_SUCCESS:
			return {
				...state,
				inspections: {
					...state.inspections,
					loadStatus: LoadStatus.success,
					inspections: action.payload.notes,
					questionNames: action.payload.questionNames
				}
			};
		case Actions.GET_INSPECTIONS_FAIL:
			return {
				...state,
				inspections: {
					...state.inspections,
					loadStatus: getNextStatusOnFail(state.inspections.loadStatus)
				}
			};
		case Actions.HIDE_INSPECTION_COLUMN:
			return {
				...state,
				inspections: {
					...state.inspections,
					hiddenQuestionNames: state.inspections.hiddenQuestionNames.concat(action.payload)
				}
			};
		case Actions.SHOW_INSPECTION_COLUMN:
			return {
				...state,
				inspections: {
					...state.inspections,
					hiddenQuestionNames: state.inspections.hiddenQuestionNames.filter((col: string) => col !== action.payload)
				}
			};
		case Actions.SET_HIDDEN_INSPECTION_COLUMNS_START:
			return {
				...state,
				inspections: {
					...state.inspections,
					hiddenQuestionNames: action.payload
				}
			};
		case Actions.GET_ALL_COMMENTS_START:
			return {
				...state,
				comments: {
					...state.comments,
					loadStatus: getNextStatusOnLoad(state.comments.loadStatus)
				}
			};
		case Actions.GET_ALL_COMMENTS_SUCCESS:
			return {
				...state,
				comments: {
					...state.comments,
					loadStatus: LoadStatus.success,
					comments: action.payload.comments,
					topics: action.payload.topics
				}
			};
		case Actions.GET_ALL_COMMENTS_FAIL:
			return {
				...state,
				comments: {
					...state.comments,
					loadStatus: getNextStatusOnLoad(state.comments.loadStatus)
				}
			};
		default:
			return state;
	}
};

export const store = configureStore({
	reducer: reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					Actions.GET_MATCHES_SUCCESS,
					Actions.CALCULATE_TEAM_STATS_START,
					Actions.CALCULATE_TEAM_STATS_SUCCESS,
					Actions.CALCULATE_GLOBAL_STATS_START,
					Actions.CALCULATE_GLOBAL_STATS_SUCCESS,
					Actions.SELECT_FIRST_TEAM_FOR_PLANNING,
					Actions.SELECT_SECOND_TEAM_FOR_PLANNING,
					Actions.SELECT_THIRD_TEAM_FOR_PLANNING,
					Actions.APPLY_PLAN_SELECTION
				],
				ignoreState: true
			}
		})
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function replaceMatch(matches: Match[], oldId: number, match: Match): Match[] {
	const targetIndex = matches.findIndex((match: Match) => match.id === oldId);
	const result = matches.slice();
	result[targetIndex] = match;

	return result;
}

function replaceRawMatch(matches: MatchResponse[], oldId: number, match: MatchResponse): MatchResponse[] {
	const targetIndex = matches.findIndex((match: MatchResponse) => match.id === oldId);
	const result = matches.slice();
	result[targetIndex] = match;

	return result;
}

function getNextStatusOnLoad(previousStatus: LoadStatus): LoadStatus {
	if (
		previousStatus === LoadStatus.success
		|| previousStatus === LoadStatus.loadingWithPriorSuccess
		|| previousStatus === LoadStatus.failedWithPriorSuccess
	) {
		return LoadStatus.loadingWithPriorSuccess;
	}

	return LoadStatus.loading;
}

function getNextStatusOnFail(previousStatus: LoadStatus): LoadStatus {
	if (previousStatus === LoadStatus.loadingWithPriorSuccess) {
		return LoadStatus.failedWithPriorSuccess;
	}

	return LoadStatus.failed;
}

function createImageStateFromInfo(info: ImageInfo[]): ImageState {
	const next: ImageState = {
		loadStatus: LoadStatus.success,
		images: {}
	};

	for (const image of info) {
		next.images[image.robotNumber] = image;
	}

	return next;
}
