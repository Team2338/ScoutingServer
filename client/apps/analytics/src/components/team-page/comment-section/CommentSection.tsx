import React, { useRef, useState } from 'react';
import './CommentSection.scss';
import { CommentsForRobot, Comment, Statelet } from '../../../models';
import { useAppSelector } from '../../../state';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslator } from '../../../service/TranslateService';
import Topic from './topic/Topic';
import { LoadStatus } from '@gearscout/models';

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
	const commentScrollRef = useRef(null);

	// TODO: show skeleton loader
	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return (
			<div className="comment-section">
				<h3 className="comment-section-title">{ translate('COMMENTS') }</h3>
				<div>{ translate('LOADING') }</div>
			</div>
		);
	}

	if (loadStatus === LoadStatus.failed) {
		return (
			<div className="comment-section">
				<h3 className="comment-section-title">{ translate('COMMENTS') }</h3>
				<div>FAILED</div>
			</div>
		);
	}

	const filteredTopics: string[] = topics.filter(
		(topic: string) => selectedTopic === ALL_TOPICS_VALUE || selectedTopic === topic
	);

	const topicElements = filteredTopics.map((topic: string) => {
		const commentsForTopic: Comment[] = comments?.[topic] ?? [];
		return (<Topic key={ topic } topic={ topic } comments={ commentsForTopic } />);
	});

	return (
		<div className="comment-section" ref={ commentScrollRef }>
			<h3 className="comment-section-title">{ translate('COMMENTS') }</h3>
			<FormControl id="topic-filter-control">
				<InputLabel id="topic-filter-label">
					{ translate('TOPIC') }
				</InputLabel>
				<Select
					labelId="topic-filter-label"
					id="topic-filter"
					value={ selectedTopic }
					label={ translate('TOPIC') }
					onChange={ (event) => {
						setSelectedTopic(event.target.value);
						setTimeout(() => commentScrollRef.current.scrollIntoView({ behavior: 'smooth' }), 0);
					}}
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
			<div className="topics-list">
				{ topicElements }
			</div>
		</div>
	);
}
