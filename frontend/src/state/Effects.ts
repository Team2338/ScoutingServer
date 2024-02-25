import {
	AppState,
	CommentsForEvent,
	Inspection,
	ImageInfo,
	Language,
	LanguageInfo,
	Match,
	MatchResponse,
	Team
} from '../models';
import commentService from '../service/CommentService';
import inspectionModelService from '../service/InspectionModelService';
import gearscoutService from '../service/GearscoutService';
import matchModelService from '../service/MatchModelService';
import statModelService from '../service/StatModelService';
import teamModelService from '../service/TeamModelService';
import {
	calculateGlobalStatsStart,
	calculateGlobalStatsSuccess,
	calculateTeamStatsStart,
	calculateTeamStatsSuccess,
	getCommentsFail,
	getCommentsStart,
	getCommentsSuccess,
	getCsvStart,
	getCsvSuccess,
	getEventImageInfoFail,
	getEventImageInfoStart,
	getEventImageInfoSuccess,
	getImageFail,
	getImageStart,
	getImageSuccess,
	getInspectionsFail,
	getInspectionsStart,
	getInspectionsSuccess,
	getMatchesFail,
	getMatchesStart,
	getMatchesSuccess,
	hideInspectionColumnStart,
	loginSuccess,
	logoutSuccess,
	replaceMatch,
	selectLangSuccess,
	setHiddenInspectionColumnsStart,
	showInspectionColumnStart
} from './Actions';
import { AppDispatch } from './Store';

type GetState = () => AppState;

export const initApp = () => async (dispatch: AppDispatch) => {
	const teamNumber: string = localStorage.getItem('teamNumber');
	const gameYear: string = localStorage.getItem('gameYear');
	const username: string = localStorage.getItem('username');
	const eventCode: string = localStorage.getItem('eventCode');
	const secretCode: string = localStorage.getItem('secretCode');

	// Only login if all information is present
	if (teamNumber && username && eventCode && secretCode) {
		dispatch(loginSuccess({
			gameYear: gameYear ? Number(gameYear) : new Date().getFullYear(),
			teamNumber: Number(teamNumber),
			username: username,
			eventCode: eventCode,
			secretCode: secretCode
		}));
	}

	const language: Language = getPreferredLanguage();
	if (language) {
		dispatch(selectLangSuccess(language));
	}

	const hiddenInspectionColumns: string = localStorage.getItem('hiddenInspectionColumns');
	if (hiddenInspectionColumns) {
		const splitColumns: string[] = hiddenInspectionColumns.split('|:');
		dispatch(setHiddenInspectionColumnsStart(splitColumns));
	}
};

const getPreferredLanguage = (): Language => {
	// Attempt to get saved language preference
	let language: Language = localStorage.getItem('language') as Language;
	if (language) {
		return language;
	}

	// Attempt to get the browser's language
	const browserPreference: string = window.navigator.language
		.trim()
		.split(/[-_]/)[0]; // Converts 'en-us' or 'en_us' to just 'en'
	language = Object.entries(LanguageInfo)
		.find(([, info]) => info.code === browserPreference)[1]
		.key;
	if (language) {
		return language;
	}

	return undefined;
};

export const selectLanguage = (language: Language) => async (dispatch: AppDispatch) => {
	dispatch(selectLangSuccess(language));
	localStorage.setItem('language', language);
};

export const setHiddenInspectionColumns = (columns: string[]) => async (dispatch: AppDispatch) => {
	dispatch(setHiddenInspectionColumnsStart(columns));
	localStorage.setItem('hiddenInspectionColumns', columns.join('|:'));
};

export const hideInspectionColumn = (column: string) => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(hideInspectionColumnStart(column));

	const hiddenColumns: string[] = getState().inspections.hiddenQuestionNames;
	localStorage.setItem('hiddenInspectionColumns', hiddenColumns.join('|:'));
};

export const showInspectionColumn = (column: string) => async (dispatch: AppDispatch, getState: GetState) => {
	dispatch(showInspectionColumnStart(column));

	const hiddenColumns: string[] = getState().inspections.hiddenQuestionNames;
	localStorage.setItem('hiddenInspectionColumns', hiddenColumns.join('|:'));
};

export const login = (data: {
	teamNumber: number;
	gameYear: number;
	username: string;
	eventCode: string;
	secretCode: string;
}) => async (dispatch: AppDispatch) => {
	localStorage.setItem('gameYear', data.gameYear.toString());
	localStorage.setItem('teamNumber', data.teamNumber.toString());
	localStorage.setItem('username', data.username);
	localStorage.setItem('eventCode', data.eventCode);
	localStorage.setItem('secretCode', data.secretCode);

	dispatch(loginSuccess(data));
};

export const logout = () => async (dispatch) => {
	localStorage.clear();

	dispatch(logoutSuccess());
};

// export const getAllData = () => async (dispatch: AppDispatch, getState: GetState) => {
// 	console.log('Getting all data');
// 	dispatch(getCsvData());
// 	await getMatches(dispatch, getState);
// 	await getTeams()(dispatch, getState);
// 	await getGlobalStats()(dispatch, getState);
// 	console.log('Got all data');
// }
//
// const getMatches = async (dispatch, getState: GetState) => {
// 	console.log('Getting matches');
// 	dispatch(getMatchesStart());
//
// 	try {
// 		const response = await gearscoutService.getMatches(getState().login.teamNumber, getState().login.eventCode, getState().login.secretCode);
// 		const matchResponses: MatchResponse[] = response.data;
// 		const matches: Match[] = matchModelService.convertMatchResponsesToModels(matchResponses);
//
// 		dispatch(getMatchesSuccess(matches, matchResponses));
// 	} catch (error) {
// 		console.error('Error getting matches', error);
// 	}
// };

export const getAllData = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting matches sync');
	dispatch(getMatchesStart());
	dispatch(calculateTeamStatsStart());
	dispatch(calculateGlobalStatsStart());
	// dispatch(getCsvData());

	try {
		const response = await gearscoutService.getMatches(
			getState().login.teamNumber,
			getState().login.gameYear,
			getState().login.eventCode,
			getState().login.secretCode
		);
		const rawMatches: MatchResponse[] = response.data;
		const matches: Match[] = matchModelService.convertMatchResponsesToModels(rawMatches);
		dispatch(getMatchesSuccess(matches, rawMatches));

		console.log('Getting teams sync');
		const teams: Team[] = teamModelService.createTeams(rawMatches);
		dispatch(calculateTeamStatsSuccess(teams));

		console.log('Getting global statistics sync');
		const globalStats = statModelService.calculateGlobalStats(teams);
		dispatch(calculateGlobalStatsSuccess(globalStats));

	} catch (error) {
		console.error('Error getting matches', error);
		dispatch(getMatchesFail());
	}
};

export const getCsvData = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting CSV');

	dispatch(getCsvStart());
	const lastUrl = getState().csv.url;

	try {
		const response = await gearscoutService.getMatchesAsCsv(
			getState().login.teamNumber,
			getState().login.gameYear,
			getState().login.eventCode,
			getState().login.secretCode
		);
		const csvContent = response.data;
		const csvBlob = new Blob([csvContent], {type: 'text/csv'});

		// Revoke last URL
		if (lastUrl) {
			window.URL.revokeObjectURL(lastUrl);
		}

		const nextUrl = window.URL.createObjectURL(csvBlob);
		dispatch(getCsvSuccess(nextUrl));
	} catch (error) {
		console.error('Error getting CSV', error);
	}
};

export const hideMatch = (match: Match) => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Hiding match');
	try {
		const response = await gearscoutService.hideMatch(getState().login.teamNumber, match.id, getState().login.secretCode);
		const rawMatch: MatchResponse = response.data;
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(rawMatch);

		dispatch(replaceMatch(match.id, updatedMatch, rawMatch));
		calculateData(dispatch, getState);
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

export const unhideMatch = (match: Match) => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Unhiding match');
	try {
		const response = await gearscoutService.unhideMatch(getState().login.teamNumber, match.id, getState().login.secretCode);
		const rawMatch = response.data;
		const updatedMatch: Match = matchModelService.convertMatchResponseToModel(rawMatch);

		dispatch(replaceMatch(match.id, updatedMatch, rawMatch));
		calculateData(dispatch, getState);
	} catch (error) {
		console.error('Error hiding match', error);
	}
};

const calculateData = (dispatch: AppDispatch, getState: GetState) => {
	dispatch(calculateTeamStatsStart());
	dispatch(calculateGlobalStatsStart());

	console.log('Getting teams sync');
	const teams: Team[] = teamModelService.createTeams(getState().matches.raw);
	dispatch(calculateTeamStatsSuccess(teams));

	console.log('Getting global statistics sync');
	const globalStats = statModelService.calculateGlobalStats(teams);
	dispatch(calculateGlobalStatsSuccess(globalStats));
};

// export const getTeams = () => async (dispatch, getState: GetState) => {
// 	console.log('Computing team statistics');
// 	dispatch(calculateTeamStatsStart());
//
// 	const matches = getState().matches.raw.filter((match: MatchResponse) => !match.isHidden); // Filter out hidden matches
// 	const teams: Team[] = teamModelService.createTeams(matches);
// 	teams.sort((a: Team, b: Team) => a.id - b.id); // Sort by team number, ascending
//
// 	dispatch(calculateTeamStatsSuccess(teams));
// };

// export const getGlobalStats = () => async (dispatch, getState: GetState) => {
// 	console.log('Computing global statistics');
// 	dispatch(calculateGlobalStatsStart());
//
// 	const teams = getState().teams.data;
// 	const globalStats = statModelService.calculateGlobalStats(teams);
// 	dispatch(calculateGlobalStatsSuccess(globalStats));
// };


export const getImageForRobot = (robotNumber: number) => async (dispatch: AppDispatch, getState: GetState) => {
	console.log(`Getting image info for ${ robotNumber }`);
	dispatch(getImageStart(robotNumber));

	let info: ImageInfo;
	try {
		const response = await gearscoutService.getImageInfo({
			teamNumber: getState().login.teamNumber,
			gameYear: getState().login.gameYear,
			eventCode: getState().login.eventCode,
			robotNumber: robotNumber,
			secretCode: getState().login.secretCode
		});
		info = response.data;

	} catch (error) {
		console.error(`Error getting image info for ${ robotNumber }`);
		dispatch(getImageFail(robotNumber));
		return;
	}

	const url: string = info.present
		? `${import.meta.env.VITE_APP_SERVER_URL}/v1/images/${info.imageId}`
		: null;
	dispatch(getImageSuccess(robotNumber, info, url));
};

export const getAllImageInfoForEvent = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting image info for event');
	dispatch(getEventImageInfoStart());

	try {
		const response = await gearscoutService.getImageInfoForEvent({
			teamNumber: getState().login.teamNumber,
			gameYear: getState().login.gameYear,
			eventCode: getState().login.eventCode,
			secretCode: getState().login.secretCode
		});

		const info: ImageInfo[] = response.data;
		dispatch(getEventImageInfoSuccess(info));
	} catch (error) {
		console.log('Error getting image info for event');
		dispatch(getEventImageInfoFail());
	}
};

export const getInspections = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting inspections for event');
	dispatch(getInspectionsStart());

	try {
		const response = await gearscoutService.getInspections({
			teamNumber: getState().login.teamNumber,
			gameYear: getState().login.gameYear,
			eventCode: getState().login.eventCode,
			secretCode: getState().login.secretCode
		});

		const inspections: Inspection[] = inspectionModelService.convertResponsesToModels(response.data);
		const questionNames: string[] = inspectionModelService.getUniqueQuestionNames(response.data);

		dispatch(getInspectionsSuccess(inspections, questionNames));
	} catch (error) {
		console.log('Error getting inspections', error);
		dispatch(getInspectionsFail());
	}
};

export const getComments = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting comments for event');
	dispatch(getCommentsStart());

	try {
		const response = await gearscoutService.getCommentsForEvent({
			teamNumber: getState().login.teamNumber,
			gameYear: getState().login.gameYear,
			eventCode: getState().login.eventCode,
			secretCode: getState().login.secretCode
		});

		const comments: CommentsForEvent = commentService.convertResponsesToModels(response.data);
		const topics: string[] = commentService.getUniqueTopics(response.data);
		dispatch(getCommentsSuccess(comments, topics));
	} catch (error) {
		console.log('Error getting comments', error);
		dispatch(getCommentsFail());
	}
};
