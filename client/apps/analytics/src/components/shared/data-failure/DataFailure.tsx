import React from 'react';
import './DataFailure.scss';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	messageKey: string;
}

export default function DataFailure(props: IProps) {
	const translate = useTranslator();

	return (
		<div className="data-failure">
			<img className="failed-icon" src="/assets/NoData.svg" alt="" role="presentation" />
			{ translate(props.messageKey) }
		</div>
	);
}
