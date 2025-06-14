import { useTranslator } from '../../../../service/TranslateService';
import {
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';

interface IProps {
	selected: string;
	options: string[];
	setSelected: (option: string) => void;
}

function TranslatedPicker(props: IProps) {
	const translate = useTranslator();

	const sortedOptions = props.options.toSorted();

	const reverseTranslations = Object.fromEntries(
		sortedOptions.map((opt) => [translate(opt), opt])
	);

	return (
		<Select
			size="small"
			value={ translate(props.selected) || '' }
			onChange={ (event: SelectChangeEvent) => {
				const next = reverseTranslations[event.target.value];
				if (next != undefined) {
					props.setSelected(next);
				}
			}}
			aria-label="Filter type"
			sx={{ display: 'block', marginBottom: '8px' }}
		>
			{
				sortedOptions.map((option) => (
					<MenuItem value={ translate(option) }>
						{ translate(option) }
					</MenuItem>
				))
			}
		</Select>
	);
}


export default TranslatedPicker;
