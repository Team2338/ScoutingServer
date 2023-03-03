import './ManagePage.scss';
import { useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react';
import { Match } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectMatch } from '../../state/Actions';
import { getMatches, hideMatch, unhideMatch } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';
import MatchSelector from './match-selector/MatchSelector';


function ManagePage() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const _selectMatch = (match: Match) => dispatch(selectMatch(match));
	const _hideMatch = (match: Match) => dispatch(hideMatch(match));
	const _unhideMatch = (match: Match) => dispatch(unhideMatch(match));
	const isMobile: boolean = useMediaQuery('(max-width: 700px)');
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
		return <div className="page manage-page">{translate('LOADING')}</div>;
	}

	if (isMobile) {
		return (
			<div className="page match-page-mobile">
				<MatchSelector
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
				></MatchSelector>
				<MatchDetail
					match={selectedMatch}
					hide={_hideMatch}
					unhide={_unhideMatch}
				/>
			</div>
		);
	}

	return (
		<div className="page manage-page">
			<div className="match-list-wrapper">
				<MatchList
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
				/>
			</div>
			<MatchDetail
				match={selectedMatch}
				hide={_hideMatch}
				unhide={_unhideMatch}
			/>
		</div>
	);
}

export default ManagePage;
