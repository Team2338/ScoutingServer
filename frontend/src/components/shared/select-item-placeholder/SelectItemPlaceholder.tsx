import './SelectItemPlaceholder.scss';
import React from 'react';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	messageKey: string;
}

export default function SelectItemPlaceholder(props: IProps) {
	const translate = useTranslator();

	return (
		<div className="select-item-placeholder">
			<img className="pointer-icon" src="/assets/Pointer.svg" alt="" role="presentation" />
			{ translate(props.messageKey) }
		</div>
	);
}
