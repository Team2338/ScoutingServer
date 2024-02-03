import { configureStore } from '@reduxjs/toolkit';
import { AppState, ImageInfo, ImageState, Language, LoadStatus, Match, MatchResponse } from '../models';
import planningService from '../service/PlanningService';
import { Action, Actions } from './Actions';


const INITIAL_STATE: AppState = {
	language: Language.ENGLISH,
	login: {
		isLoggedIn: false,
		teamNumber: null,
		gameYear: new Date().getFullYear(),
		username: null,
		eventCode: null,
		secretCode: null,
	},
	csv: {
		loadStatus: LoadStatus.none,
		url: null
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
		selectedStat: null
	},
	planning: {
		loadStatus: LoadStatus.none,
		firstTeam: null,
		secondTeam: null,
		thirdTeam: null,
		plan: null
	},
	images: {},
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
				login: {
					...state.login,
					isLoggedIn: true,
					teamNumber: action.payload.teamNumber,
					gameYear: action.payload.gameYear,
					username: action.payload.username,
					eventCode: action.payload.eventCode,
					secretCode: action.payload.secretCode
				}
			};
		case Actions.LOGOUT:
			return {
				...INITIAL_STATE,
				language: state.language
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
					selectedStat: null // Guaranteed to have modified the data we were previously viewing, so hide it
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
					selectedStat: {
						gamemode: action.payload.gamemode,
						objective: action.payload.objective
					}
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
		case Actions.GET_IMAGE_START:
			return {
				...state,
				images: {
					...state.images,
					[action.payload]: {
						loadStatus: getNextStatusOnLoad(state.images[action.payload]?.loadStatus ?? LoadStatus.none),
						url: state.images[action.payload]?.url, // Sets to null if this team previously was not saved
						info: state.images[action.payload]?.info // Sets to null if this team previously was not saved
					}
				}
			};
		case Actions.GET_IMAGE_FAIL:
			return {
				...state,
				images: {
					...state.images,
					[action.payload]: {
						...state.images[action.payload],
						loadStatus: getNextStatusOnFail(state.images[action.payload].loadStatus),
					}
				}
			};
		case Actions.GET_IMAGE_SUCCESS:
			return {
				...state,
				images: {
					...state.images,
					[action.payload.robotNumber]: {
						loadStatus: LoadStatus.success,
						info: action.payload.info,
						url: action.payload.url
					}
				}
			};
		case Actions.KEEP_CACHED_IMAGE:
			return {
				...state,
				images: {
					...state.images,
					[action.payload]: {
						...state.images[action.payload],
						loadStatus: LoadStatus.success
					}
				}
			};
		case Actions.GET_EVENT_IMAGE_INFO_START:
			return state;
		case Actions.GET_EVENT_IMAGE_INFO_FAIL:
			return state;
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
	const next: ImageState = {};

	info.forEach((image: ImageInfo) => {
		next[image.robotNumber] = {
			info: image,
			url: null,
			loadStatus: LoadStatus.none
		};
	});

	return next;
}
