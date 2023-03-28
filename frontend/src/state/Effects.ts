import { AppState, ImageInfo, Language, Match, MatchResponse, NewNote, Note, Team } from '../models';
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
	getCsvSuccess, getImageFail, getImageStart, getImageSuccess,
	getMatchesFail,
	getMatchesStart,
	getMatchesSuccess,
	getNotesForRobotStart,
	getNotesForRobotSuccess,
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
// 		const response = await gearscoutService.getMatches(getState().teamNumber, getState().eventCode, getState().secretCode);
// 		const matchResponses: MatchResponse[] = response.data;
// 		const matches: Match[] = matchModelService.convertMatchResponsesToModels(matchResponses);
//
// 		dispatch(getMatchesSuccess(matches, matchResponses));
// 	} catch (error) {
// 		console.error('Error getting matches', error);
// 	}
// };

export const getAllData = () => async (dispatch: AppDispatch, getState: GetState) => {
	console.log('Getting matches sync')
	dispatch(getMatchesStart());
	dispatch(calculateTeamStatsStart());
	dispatch(calculateGlobalStatsStart());
	// dispatch(getCsvData());

	try {
		const response = await gearscoutService.getMatches(getState().teamNumber, getState().eventCode, getState().secretCode);
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
}

export const getCsvData = () => async (dispatch, getState: GetState) => {
	console.log('Getting CSV');

	dispatch(getCsvStart());
	const lastUrl = getState().csv.url;

	try {
		const response = await gearscoutService.getMatchesAsCsv(getState().teamNumber, getState().eventCode, getState().secretCode);
		const csvContent = response.data;
		const csvBlob = new Blob([csvContent], { type: 'text/csv' });

		// Revoke last URL
		if (lastUrl) {
			window.URL.revokeObjectURL(lastUrl);
		}

		const nextUrl = window.URL.createObjectURL(csvBlob);
		dispatch(getCsvSuccess(nextUrl));
	} catch (error) {
		console.error('Error getting CSV', error);
	}
}

export const hideMatch = (match: Match) => async (dispatch, getState: GetState) => {
	console.log('Hiding match');
	try {
		const response = await gearscoutService.hideMatch(getState().teamNumber, match.id, getState().secretCode);
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
		const response = await gearscoutService.unhideMatch(getState().teamNumber, match.id, getState().secretCode);
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
}

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
			getState().teamNumber,
			getState().eventCode,
			robotNumber,
			getState().secretCode
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
			getState().teamNumber,
			getState().eventCode,
			getState().secretCode
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
		eventCode: getState().eventCode,
		creator: getState().username,
		content: content
	};

	const dummyCompleteNote: Note = {
		...note,
		teamNumber: getState().teamNumber,
		secretCode: getState().secretCode,
		id: -getState().notes.data.length,
		timeCreated: null
	}

	try {
		await gearscoutService.addNote(getState().teamNumber, getState().secretCode, note);
		dispatch(addNoteSuccess(dummyCompleteNote));
	} catch (error) {
		console.error('Error adding note', error);
	}
};

export const getImageForRobot = (robotNumber: number) => async (dispatch: AppDispatch, getState: GetState) => {
	console.log(`Getting image info for ${robotNumber}`);
	dispatch(getImageStart(robotNumber));

	let info: ImageInfo;
	try {
		const response = await gearscoutService.getImageInfo({
			teamNumber: getState().teamNumber,
			gameYear: new Date().getFullYear(),
			robotNumber: robotNumber,
			secretCode: getState().secretCode
		});
		info = response.data;

	} catch (error) {
		console.error(`Error getting image info for ${robotNumber}`);
		dispatch(getImageFail(robotNumber));
		return;
	}

	if (!info.present) {
		dispatch(getImageSuccess(robotNumber, info, null));
		return;
	}

	let content;
	try {
		console.log(`Getting image content for ${robotNumber}`);
		const response = await gearscoutService.getImageContent({
			imageId: info.imageId,
			secretCode: getState().secretCode
		});
		content = response.data;
	} catch (error) {
		console.error(`Error getting image content for ${robotNumber}`);
		dispatch(getImageFail(robotNumber));
	}

	const blob = new Blob([content], { type: 'image/jpeg' })
	const url: string = window.URL.createObjectURL(blob);
	dispatch(getImageSuccess(robotNumber, info, url));
};
