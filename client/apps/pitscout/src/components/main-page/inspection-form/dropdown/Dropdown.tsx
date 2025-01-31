import {
	FormControl,
	InputLabel,
	MenuItem,
	Select
} from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
	id: string;
	title: string;
	options: string[];
	value: string;
	onChange: (value: string) => void;
	icon?: ReactNode;
}

export default function Dropdown(props: IProps) {

	const labelId = props.id + '__label';

	return (
		<FormControl margin="normal">
			<InputLabel id={ labelId }>{ props.title }</InputLabel>
			<Select
				id={ props.id }
				labelId={ labelId }
				value={ props.value }
				label={ props.title }
				onChange={ (event) => props.onChange(event.target.value) }
				startAdornment={ props.icon }
			>
				{
					props.options.map(option => (
						<MenuItem key={ option } value={ option }>{ option }</MenuItem>
					))
				}
			</Select>
		</FormControl>
	);

}
