import { InputAdornment, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslator } from '../../../service/TranslateService';
import { useDebounce } from '../../../state';
import SearchIcon from '@mui/icons-material/Search';

interface IProps {
	onSearch: (searchTerm: string) => void;
	size: 'small' | 'medium';
}

export default function SearchInput({ onSearch, size }: IProps) {
	const translate = useTranslator();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm: string = useDebounce(searchTerm, 300);

	useEffect(
		() => {
			onSearch(debouncedSearchTerm);
		},
		[onSearch, debouncedSearchTerm]
	);

	return (
		<TextField
			id="search-input"
			// label={ translate('SEARCH') }
			placeholder={ translate('SEARCH') }
			name="search"
			type="search"
			margin="none"
			variant="outlined"
			size={ size }
			fullWidth={ true }
			value={ searchTerm }
			onChange={ (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value) }
			autoComplete="off"
			slotProps={{
				input: {
					startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>
				}
			}}
		/>
	);
}
