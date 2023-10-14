import React, { useState } from 'react';
import './CommentSection.scss';
import { CommentsForRobot, LoadStatus, Statelet } from '../../../models';
import { useAppSelector } from '../../../state';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	teamNumber: number;
}

const ALL_TOPICS_VALUE: string = 'ALL';

export default function CommentSection(props: IProps) {
	const loadStatus: LoadStatus = useAppSelector(state => state.comments.loadStatus);
	const topics: string[] = useAppSelector(state => state.comments.topics);
	const comments: CommentsForRobot = useAppSelector(state => state.comments.comments[props.teamNumber]);
	const [selectedTopic, setSelectedTopic]: Statelet<string> = useState(ALL_TOPICS_VALUE);
	const translate = useTranslator();

	// TODO: show skeleton loader
	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return (
			<div className="comment-section">
				<h2>{ translate('COMMENTS') }</h2>
				<div>{ translate('LOADING') }</div>
			</div>
		);
	}

	if (loadStatus === LoadStatus.failed) {
		return (
			<div className="comment-section">
				<h2>{ translate('COMMENTS') }</h2>
				<div>FAILED</div>
			</div>
		);
	}

	const topicElements = [];
	const filteredTopics: string[] = topics.filter((topic: string) =>
		selectedTopic === ALL_TOPICS_VALUE || selectedTopic === topic
	);
	for (const topic of filteredTopics) {
		const commentElements = [];
		for (const comment of comments[topic]) {
			commentElements.push((
				<div className="comment">
					<div className="comment__info">
						<div className="comment__info__match-number">{ translate('MATCH') } { comment.matchNumber }</div>
						<div className="comment__info__creator">{ comment.creator }</div>
					</div>
					<div className="comment__content">{ comment.content }</div>
				</div>
			));
		}

		topicElements.push((
			<div className="topic">
				<h3 className="topic-name">{ translate(topic) }</h3>
				<div className="topic-comments">{ commentElements }</div>
			</div>
		));
	}

	return (
		<div className="comment-section">
			<h2 className="comment-section-title">{ translate('COMMENTS') }</h2>
			<FormControl sx={{ minWidth: 12 }}>
				<InputLabel id="topic-filter-label">
					{ translate('TOPIC') }
				</InputLabel>
				<Select
					labelId="topic-filter-label"
					id="topic-filter"
					value={ selectedTopic }
					label={ translate('TOPIC') }
					onChange={ (event) => setSelectedTopic(event.target.value) }
					autoWidth={ true }
				>
					<MenuItem key={ ALL_TOPICS_VALUE } value={ ALL_TOPICS_VALUE }>{ translate('ALL') }</MenuItem>
					{
						topics.map((topic: string) => (
							<MenuItem key={ topic } value={ topic }>{ translate(topic) }</MenuItem>
						))
					}
				</Select>
			</FormControl>
			{ topicElements }
		</div>
	);
}
