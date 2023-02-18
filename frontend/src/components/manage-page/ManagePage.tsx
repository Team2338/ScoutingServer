import './ManagePage.scss';
import React, { useEffect } from 'react';
import { Match } from '../../models/response.model';
import { selectMatch } from '../../state/Actions';
import { getMatches, hideMatch, unhideMatch } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';


function ManagePage() {

	const dispatch = useAppDispatch();
	const isLoaded: boolean = useAppSelector(state => state.matches.isLoaded);
	const matches: Match[] = useAppSelector(state => state.matches.data);
	const selectedMatch: Match = useAppSelector(state => state.matches.selectedMatch);

	useEffect(
		() => {
			dispatch(getMatches());
		},
		[dispatch]
	);

	if (!isLoaded) {
		return <div className="page manage-page">Loading...</div>;
	}

	return (
		<div className="page manage-page">
			<div className="match-list-wrapper">
				<MatchList
					matches={matches}
					selectMatch={(match: Match) => dispatch(selectMatch(match))}
					selectedMatch={selectedMatch}
				/>
			</div>
			<MatchDetail
				match={selectedMatch}
				hide={(match: Match) => dispatch(hideMatch(match))}
				unhide={(match: Match) => dispatch(unhideMatch(match))}
			/>
		</div>
	);
}

export default ManagePage;
