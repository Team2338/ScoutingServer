import { Dialog, DialogContent, Divider, Icon, IconButton, Slide, Typography, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react';
import { LoadStatus, Match } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { getAllData, hideMatch, selectMatch, unhideMatch, useAppDispatch, useAppSelector } from '../../state';
import SearchInput from '../shared/search-input/SearchInput';
import './ManagePage.scss';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } { ...props }>{ props.children }</Slide>;
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
			dispatch(getAllData());
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
			<main className="page match-page-mobile">
				<div className="match-list-wrapper__header">
					<SearchInput onSearch={ setSearchTerm } size="medium" />
				</div>
				<Divider />
				<MatchList
					matches={ matches }
					selectMatch={ _selectMatch }
					selectedMatch={ selectedMatch }
					searchTerm={ searchTerm }
					isMobile={ true }
				/>
				<Dialog
					fullScreen={ true }
					open={ !!selectedMatch }
					onClose={ () => _selectMatch(null) }
					aria-labelledby="match-detail-dialog__title"
					TransitionComponent={ Transition }
				>
					<div className="match-detail-dialog__header">
						<IconButton
							id="match-detail-dialog__back-button"
							color="inherit"
							aria-label={ translate('CLOSE') }
							onClick={ () => _selectMatch(null) }
						>
							<Icon>arrow_back</Icon>
						</IconButton>
						<span id="match-detail-dialog__title">
							{ translate('MATCH') } { selectedMatch?.matchNumber ?? '' }
							&nbsp;|&nbsp;
							{ translate('TEAM') } { selectedMatch?.robotNumber ?? '' }
						</span>
					</div>
					<DialogContent
						dividers={ true }
						sx={ {
							paddingLeft: '8px',
							paddingRight: '8px',
							paddingTop: '12px'
						} }
					>
						<MatchDetail
							match={ selectedMatch }
							hide={ _hideMatch }
							unhide={ _unhideMatch }
							isMobile={ true }
						/>
					</DialogContent>
				</Dialog>
			</main>
		);
	}

	return (
		<main className="page manage-page">
			<div className="match-list-wrapper">
				<div className="match-list-wrapper__header">
					<Typography
						variant="h6"
						sx={ {
							marginBottom: '4px'
						} }
					>
						{ translate('MATCHES') }
					</Typography>
					<SearchInput onSearch={ setSearchTerm } size="small" />
				</div>
				<Divider variant="fullWidth" />
				<MatchList
					matches={ matches }
					selectMatch={ _selectMatch }
					selectedMatch={ selectedMatch }
					searchTerm={ searchTerm }
					isMobile={ false }
				/>
			</div>
			<MatchDetail
				match={ selectedMatch }
				hide={ _hideMatch }
				unhide={ _unhideMatch }
				isMobile={ false }
				sx={ {
					margin: '12px 12px'
				} }
			/>
		</main>
	);
}

export default ManagePage;
