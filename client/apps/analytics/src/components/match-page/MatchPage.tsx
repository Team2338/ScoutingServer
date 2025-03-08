import { LoadStatus } from '@gearscout/models';
import { RefreshRounded } from '@mui/icons-material';
import { Dialog, DialogContent, Divider, Icon, IconButton, Slide, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Match, Statelet } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { getAllData, hideMatch, selectMatch, unhideMatch, useAppDispatch, useAppSelector } from '../../state';
import DataFailure from '../shared/data-failure/DataFailure';
import SearchInput from '../shared/search-input/SearchInput';
import './MatchPage.scss';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } { ...props }>{ props.children }</Slide>;
});

function MatchPage() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const isMobile: boolean = useMediaQuery('(max-width: 700px)');
	const lastUpdated: string = useAppSelector(state => state.matches.lastUpdated);
	const loadStatus: LoadStatus = useAppSelector(state => state.matches.loadStatus);
	const matches: Match[] = useAppSelector(state => state.matches.data);
	const selectedMatch: Match = useAppSelector(state => state.matches.selectedMatch);
	const [searchTerm, setSearchTerm]: Statelet<string> = useState<string>('');

	const formattedUpdateTime: string = useMemo(() => {
		return Intl.DateTimeFormat('fr', {
			dateStyle: undefined,
			timeStyle: 'short'
		}).format(new Date(lastUpdated));
	}, [lastUpdated]);

	const _selectMatch = (match: Match) => dispatch(selectMatch(match));
	const _hideMatch = (match: Match) => dispatch(hideMatch(match));
	const _unhideMatch = (match: Match) => dispatch(unhideMatch(match));
	const _reloadMatches = () => {
		if (loadStatus === LoadStatus.loadingWithPriorSuccess)  {
			return;
		}

		dispatch(getAllData());
	};

	useEffect(
		() => {
			dispatch(getAllData());
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <main className="page match-page">{ translate('LOADING') }</main>;
	}

	if (loadStatus === LoadStatus.failed) {
		return (
			<main className="page match-page match-page-failed">
				<DataFailure messageKey="FAILED_TO_LOAD_MATCHES"/>
			</main>
		);
	}

	if (isMobile) {
		return (
			<main className="page match-page-mobile">
				<div className="match-list-wrapper__header">
					<SearchInput onSearch={ setSearchTerm } size="medium"/>
				</div>
				<Divider/>
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
						sx={{
							paddingLeft: '8px',
							paddingRight: '8px',
							paddingTop: '12px'
						}}
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
		<main className="page match-page">
			<div className="match-list-wrapper">
				<div className="match-list-wrapper__header">
					<div className="title-and-reload">
						<div className="title-and-updated">
							<h2 className="title">{ translate('MATCHES') }</h2>
							<span className="last-updated">{
								translate('LAST_UPDATED_AT').replace('{TIME}', formattedUpdateTime)
							}</span>
						</div>
						<IconButton
							className="reload-button"
							size="small"
							aria-label={ translate('REFRESH_DATA') }
							disabled={ loadStatus === LoadStatus.loadingWithPriorSuccess }
							onClick={ _reloadMatches }
						>
							<RefreshRounded />
						</IconButton>
					</div>
					<SearchInput onSearch={ setSearchTerm } size="small"/>
				</div>
				<Divider variant="fullWidth"/>
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
				sx={{
					margin: '12px 12px'
				}}
			/>
		</main>
	);
}

export default MatchPage;
