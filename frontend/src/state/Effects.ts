import {
	AppState,
	Inspection,
	ImageInfo,
	Language,
	LanguageInfo,
	Match,
	MatchResponse,
	Team,
	GlobalObjectiveStats,
	ImageInfoResponse
} from '../models';
import imageModelService from '../service/ImageModelService';
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
	getEventImageInfoFail,
	getEventImageInfoStart,
	getEventImageInfoSuccess,
	getInspectionsFail,
	getInspectionsStart,
	getInspectionsSuccess,
	getMatchesFail,
	getMatchesStart,
	getMatchesSuccess,
	hideInspectionColumnStart,
	replaceMatch,
	selectLangSuccess,
	setHiddenInspectionColumnsStart,
	showInspectionColumnStart
} from './Actions';
import { AppDispatch } from './Store';

type GetState = () => AppState;

export const initApp = () => async (dispatch: AppDispatch) => {
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

export const getAllData = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting matches sync');
	dispatch(getMatchesStart());
	dispatch(calculateTeamStatsStart());
	dispatch(calculateGlobalStatsStart());

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
		const globalStats: GlobalObjectiveStats[] = statModelService.calculateGlobalStats(teams);
		dispatch(calculateGlobalStatsSuccess(globalStats));

	} catch (error) {
		console.error('Error getting matches', error);
		dispatch(getMatchesFail());
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

		const infoResponses: ImageInfoResponse[] = response.data;
		const info: ImageInfo[] = imageModelService.createImageInfo(infoResponses);
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
