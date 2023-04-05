import { Dialog, DialogContent, Divider, Icon, IconButton, Slide, Typography, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react';
import { Match, LoadStatus } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectMatch } from '../../state/Actions';
import { getAllData, hideMatch, unhideMatch } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import './ManagePage.scss';
import SearchInput from '../shared/search-input/SearchInput';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';
// import MatchSelector from './match-selector/MatchSelector';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

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
				{/*
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
				*/}
				<MatchList
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
					searchTerm={searchTerm}
				/>
				<Dialog
					fullScreen={true}
					open={!!selectedMatch}
					onClose={() => _selectMatch(null)}
					aria-labelledby="match-detail-dialog__title"
					TransitionComponent={Transition}
				>
					<div className="match-detail-dialog__header">
						<IconButton
							id="match-detail-dialog__back-button"
							color="inherit"
							aria-label="back" // TODO: translate
							onClick={() => _selectMatch(null)}
						>
							<Icon>arrow_back</Icon>
						</IconButton>
						<span id="match-detail-dialog__title">
							{ translate('MATCH') } { selectedMatch?.matchNumber ?? '' }
							&nbsp;|&nbsp;
							{ translate('TEAM') } { selectedMatch?.robotNumber ?? '' }
						</span>
					</div>
					<DialogContent>
						<MatchDetail
							match={selectedMatch}
							hide={_hideMatch}
							unhide={_unhideMatch}
						/>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className="page manage-page">
			<div className="match-list-wrapper">
				<div className="match-list-wrapper__header">
					<Typography
						variant="h6"
						sx={{
							marginBottom: '4px'
						}}
					>
						{ translate('MATCHES') }
					</Typography>
					<SearchInput onSearch={setSearchTerm}/>
				</div>
				<Divider variant="fullWidth"/>
				<MatchList
					matches={matches}
					selectMatch={_selectMatch}
					selectedMatch={selectedMatch}
					searchTerm={searchTerm}
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
