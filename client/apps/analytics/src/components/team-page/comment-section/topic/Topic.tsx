import './Topic.scss';
import React from 'react';
import { Comment } from '../../../../models';
import { useTranslator } from '../../../../service/TranslateService';

interface IProps {
	topic: string;
	comments: Comment[];
}

export default function Topic(props: IProps) {
	const translate = useTranslator();

	const commentElements = props.comments.map((comment: Comment, index: number) => (
		<div key={ index } className="comment">
			<div className="comment-info">
				<div className="comment-info__match-number">{ translate('MATCH') } { comment.matchNumber }</div>
				<div className="comment-info__creator">{ comment.creator }</div>
			</div>
			<div className="comment-content">{ comment.content }</div>
		</div>
	));

	return (
		<div className="topic">
			<h3 className="topic-name">{ translate(props.topic) }</h3>
			{
				props.comments.length === 0
					? <div className="topic-no-comments">{ translate('NO_COMMENTS_FOR_TOPIC') }</div>
					: <div className="topic-comments">{ commentElements }</div>
			}
		</div>
	);
}
