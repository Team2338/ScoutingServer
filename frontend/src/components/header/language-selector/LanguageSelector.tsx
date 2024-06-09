import './LanguageSelector.scss';
import { Button, Icon, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { Language, LanguageDescriptor, LanguageInfo, Statelet } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { selectLanguage, useAppDispatch, useAppSelector } from '../../../state';

interface IProps {
	id?: string;
}

export default function LanguageSelector(props: IProps) {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const [languageAnchor, setLanguageAnchor]: Statelet<Element> = useState(null);
	const selectedLanguage: Language = useAppSelector(state => state.language);

	const handleLanguageMenuClick = (event): void => {
		setLanguageAnchor(event.currentTarget);
	};

	const handleLanguageMenuClose = (): void => {
		setLanguageAnchor(null);
	};

	const handleLanguageChange = (language: Language): void => {
		dispatch(selectLanguage(language));
		handleLanguageMenuClose();
	};

	const languageOptions: ReactElement[] = Object.values(LanguageInfo)
		.map((info: LanguageDescriptor) => (
			<MenuItem
				key={ info.key }
				lang={ info.code }
				translate="no"
				selected={ selectedLanguage === info.key }
				onClick={ () => handleLanguageChange(info.key) }
			>
				{ info.localName }
			</MenuItem>
		));

	return (
		<React.Fragment>
			<Tooltip title={ translate('CHANGE_LANGUAGE') }>
				<Button
					id={ props.id }
					className="language-button"
					color="primary"
					variant="contained"
					disableElevation={ true }
					startIcon={ <Icon>language</Icon> }
					onClick={ handleLanguageMenuClick }
					aria-label={ translate('CHANGE_LANGUAGE') }
					aria-controls="language-menu"
					aria-haspopup="true"
				>
					{ translate('LANGUAGE') }
				</Button>
			</Tooltip>
			<Menu
				id="language-menu"
				anchorEl={ languageAnchor }
				open={ Boolean(languageAnchor) }
				onClose={ handleLanguageMenuClose }
				keepMounted
			>
				{ languageOptions }
			</Menu>
		</React.Fragment>
	);
}
