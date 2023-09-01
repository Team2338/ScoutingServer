import { AppState, DetailNote, ImageInfo, Language, Match, MatchResponse, NewNote, Note, Team } from '../models';
import detailNotesModelService from '../service/DetailNotesModelService';
import gearscoutService from '../service/GearscoutService';
import matchModelService from '../service/MatchModelService';
import statModelService from '../service/StatModelService';
import teamModelService from '../service/TeamModelService';
import {
	addNoteStart,
	addNoteSuccess,
	calculateGlobalStatsStart,
	calculateGlobalStatsSuccess,
	calculateTeamStatsStart,
	calculateTeamStatsSuccess,
	getAllNotesStart,
	getAllNotesSuccess,
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
	getNotesForRobotStart,
	getNotesForRobotSuccess,
	keepCachedImage,
	loginSuccess,
	logoutSuccess,
	replaceMatch,
	selectLangSuccess
} from './Actions';
import { AppDispatch } from './Store';

type GetState = () => AppState;

export const initApp = () => async (dispatch: AppDispatch) => {
	const teamNumber: string = localStorage.getItem('teamNumber');
	const username: string = localStorage.getItem('username');
	const eventCode: string = localStorage.getItem('eventCode');
	const secretCode: string = localStorage.getItem('secretCode');

	// Only login if all information is present
	if (teamNumber && username && eventCode && secretCode) {
		dispatch(loginSuccess(Number(teamNumber), username, eventCode, secretCode));
	}

	const language: Language = localStorage.getItem('language') as Language;
	if (language) {
		dispatch(selectLangSuccess(language));
	}
};

export const selectLanguage = (language: Language) => async (dispatch: AppDispatch) => {
	localStorage.setItem('language', language);
	dispatch(selectLangSuccess(language));
};

export const login = (
	teamNumber: number,
	username: string,
	eventCode: string,
	secretCode: string
) => async (dispatch: AppDispatch) => {
	localStorage.setItem('teamNumber', teamNumber.toString());
	localStorage.setItem('username', username);
	localStorage.setItem('eventCode', eventCode);
	localStorage.setItem('secretCode', secretCode);

	dispatch(loginSuccess(teamNumber, username, eventCode, secretCode));
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
		const response = await gearscoutService.getMatches(getState().login.teamNumber, getState().login.eventCode, getState().login.secretCode);
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

export const getCsvData = () => async (dispatch, getState: GetState) => {
	console.log('Getting CSV');

	dispatch(getCsvStart());
	const lastUrl = getState().csv.url;

	try {
		const response = await gearscoutService.getMatchesAsCsv(getState().login.teamNumber, getState().login.eventCode, getState().login.secretCode);
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

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
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

export const unhideMatch = (match: Match) => async (dispatch, getState: GetState) => {
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

export const getNotesForRobot = (robotNumber: number) => async (dispatch, getState: GetState) => {
	console.log('Getting notes for robot');
	dispatch(getNotesForRobotStart(robotNumber));

	try {
		const response = await gearscoutService.getNotesForRobot(
			getState().login.teamNumber,
			getState().login.eventCode,
			robotNumber,
			getState().login.secretCode
		);
		const notes: Note[] = response.data;

		dispatch(getNotesForRobotSuccess(notes));
	} catch (error) {
		console.error('Error getting notes for robot', error);
	}
};

export const getAllNotes = () => async (dispatch, getState: GetState) => {
	console.log('Getting all notes');
	dispatch(getAllNotesStart());

	try {
		const response = await gearscoutService.getAllNotes(
			getState().login.teamNumber,
			getState().login.eventCode,
			getState().login.secretCode
		);
		const notes: Note[] = response.data;

		dispatch(getAllNotesSuccess(notes));
	} catch (error) {
		console.error('Error getting all notes', error);
	}
};

export const addNoteForRobot = (robotNumber: number, content: string) => async (dispatch, getState: GetState) => {
	console.log('Adding note for robot');
	dispatch(addNoteStart());

	const note: NewNote = {
		robotNumber: robotNumber,
		eventCode: getState().login.eventCode,
		creator: getState().login.username,
		content: content
	};

	const dummyCompleteNote: Note = {
		...note,
		teamNumber: getState().login.teamNumber,
		secretCode: getState().login.secretCode,
		id: -getState().notes.data.length,
		timeCreated: null
	};

	try {
		await gearscoutService.addNote(getState().login.teamNumber, getState().login.secretCode, note);
		dispatch(addNoteSuccess(dummyCompleteNote));
	} catch (error) {
		console.error('Error adding note', error);
	}
};

export const getImageForRobot = (robotNumber: number) => async (dispatch: AppDispatch, getState: GetState) => {
	console.log(`Getting image info for ${ robotNumber }`);
	dispatch(getImageStart(robotNumber));

	let info: ImageInfo;
	try {
		const response = await gearscoutService.getImageInfo({
			teamNumber: getState().login.teamNumber,
			gameYear: new Date().getFullYear(),
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

	// Don't fetch image content if none exist
	if (!info.present) {
		dispatch(getImageSuccess(robotNumber, info, null));
		return;
	}

	// Use cached image if ID hasn't changed
	if (info.imageId === getState().images[robotNumber]?.info?.imageId && !!getState().images[robotNumber].url) {
		console.log(`Reusing cached image for ${ robotNumber }`);
		dispatch(keepCachedImage(robotNumber));
		return;
	}

	const previousUrl: string = getState().images[robotNumber]?.url;
	if (previousUrl) {
		window.URL.revokeObjectURL(previousUrl);
	}

	let content;
	let contentType: string;
	try {
		console.log(`Getting image content for ${ robotNumber }`);
		const response = await gearscoutService.getImageContent({
			imageId: info.imageId,
			secretCode: getState().login.secretCode
		});
		content = response.data;
		contentType = response.headers['content-type'];
	} catch (error) {
		console.error(`Error getting image content for ${ robotNumber }`);
		dispatch(getImageFail(robotNumber));
	}

	const blob = new Blob([content], {type: contentType});
	const url: string = window.URL.createObjectURL(blob);
	dispatch(getImageSuccess(robotNumber, info, url));
};

export const getAllImageInfoForEvent = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting image info for event');
	dispatch(getEventImageInfoStart());

	try {
		const response = await gearscoutService.getImageInfoForEvent({
			teamNumber: getState().login.teamNumber,
			gameYear: 2023,
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
	console.log('Getting detail notes for event');
	dispatch(getInspectionsStart());

	try {
		const response = await gearscoutService.getDetailNotes({
			teamNumber: getState().login.teamNumber,
			gameYear: 2023,
			eventCode: getState().login.eventCode,
			secretCode: getState().login.secretCode
		});

		const inspections: DetailNote[] = detailNotesModelService.convertResponsesToModels(response.data);
		const questionNames: string[] = detailNotesModelService.getUniqueQuestionNames(response.data);

		dispatch(getInspectionsSuccess(inspections, questionNames));
	} catch (error) {
		console.log('Error getting detail notes', error);
		dispatch(getInspectionsFail());
	}
};
