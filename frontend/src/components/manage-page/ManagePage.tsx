import { Divider, TextField, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Match, LoadStatus } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectMatch } from '../../state/Actions';
import { getAllData, hideMatch, unhideMatch } from '../../state/Effects';
import { useAppDispatch, useAppSelector, useDebounce } from '../../state/Hooks';
import './ManagePage.scss';
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
	const loadStatus: LoadStatus = useAppSelector(state => state.matches.loadStatus);
	const matches: Match[] = useAppSelector(state => state.matches.data);
	const selectedMatch: Match = useAppSelector(state => state.matches.selectedMatch);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm: string = useDebounce(searchTerm, 500);

	useEffect(
		() => {
			dispatch(getAllData())
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <div className="page manage-page">{ translate('LOADING') }</div>;
	}

	if (loadStatus === LoadStatus.failed) {
		return <div className="page manage-page">{ translate('FAILED') }</div>;
	}

	if (isMobile) {
		return (
			<div className="page match-page-mobile">
				<MatchSelector
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
				/>
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
				<div className="match-list__action-area">
					<TextField
						id="search-input"
						label={translate('SEARCH')}
						name="search"
						type="text"
						margin="none"
						variant="outlined"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						autoComplete="off"
					/>

				</div>
				<Divider variant="fullWidth"/>
				<MatchList
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
					searchTerm={debouncedSearchTerm}
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
