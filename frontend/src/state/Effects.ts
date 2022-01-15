import gearscoutService from '../api/GearscoutService';
import { getMatchesStart, getMatchesSuccess } from './Actions';

export const getMatches = (teamNumber: number, eventCode: string) => async (dispatch) => {
	console.log('Getting matches');

	try {
		dispatch(getMatchesStart());
		let response = await gearscoutService.getMatches(teamNumber, eventCode);
		dispatch(getMatchesSuccess(response.data));
	} catch (error) {
		console.log('Error getting matches', error);
	}
}
