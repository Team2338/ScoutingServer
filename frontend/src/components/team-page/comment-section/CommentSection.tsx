import React, { useState } from 'react';
import './CommentSection.scss';
import { CommentsForRobot, LoadStatus, Statelet } from '../../../models';
import { useAppSelector } from '../../../state';
import { MenuItem, Select } from '@mui/material';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	teamNumber: number;
}

export default function CommentSection(props: IProps) {
	const loadStatus: LoadStatus = useAppSelector(state => state.comments.loadStatus);
	const topics: string[] = useAppSelector(state => state.comments.topics);
	const comments: CommentsForRobot = useAppSelector(state => state.comments.comments[props.teamNumber]);
	const [selectedTopic, setSelectedTopic]: Statelet<string> = useState('ALL');
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
	for (const topic in topics) {
		const commentElements = [];
		for (const comment of comments[topic]) {
			commentElements.push((
				<div className="comment">
					<div className="comment__match-number">{ translate('MATCH') + comment.matchNumber }</div>
					<div className="comment__content">{ comment.content }</div>
					<div className="comment__creator">{ comment.creator }</div>
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
			<h2>{ translate('COMMENTS') }</h2>
			<Select
				id="topic-filter"
				value={ selectedTopic }
				label={ translate('TOPIC') }
				onChange={ (event) => setSelectedTopic(event.target.value) }
			>
				<MenuItem key="ALL" value="ALL">{ translate('ALL') }</MenuItem>
				{
					topics.map((topic: string) => (
						<MenuItem key={ topic } value={ topic }>{ translate(topic) }</MenuItem>
					))
				}
			</Select>
			{ topicElements }
		</div>
	);
}
