import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslator } from '../../../service/TranslateService';
import { useDebounce } from '../../../state/Hooks';

interface IProps {
	onSearch: (searchTerm: string) => void;
}

export default function SearchInput({ onSearch }: IProps) {
	const translate = useTranslator();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm: string = useDebounce(searchTerm, 300);

	useEffect(
		() => {
			onSearch(debouncedSearchTerm)
		},
		[onSearch, debouncedSearchTerm]
	);

	return (
		<TextField
			id="search-input"
			label={translate('SEARCH')}
			name="search"
			type="text"
			margin="none"
			variant="outlined"
			value={searchTerm}
			onChange={(event) => setSearchTerm(event.target.value)}
			autoComplete="off"
		/>
	);
}
