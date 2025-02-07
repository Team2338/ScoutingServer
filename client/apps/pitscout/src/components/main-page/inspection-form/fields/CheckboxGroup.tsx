import {
	Checkbox,
	FormControlLabel,
	FormGroup
} from '@mui/material';
import '../InspectionForm.scss';

interface IProps {
	title: string;
	options: string[];
	values: string[];
	includeNoneOption?: boolean;
	onChange: (values: string[]) => void;
}

const NONE = 'None';

export default function CheckboxGroup(props: IProps) {

	const handleSelection = (event, option: string): void => {
		if (event.target.checked && !props.values.includes(option)) {
			const nextValues = props.values
				.filter((value: string) => value !== NONE)
				.concat(option);
			props.onChange(nextValues);
			return;
		}

		if (!event.target.checked && props.values.includes(option)) {
			const updatedValues: string[] = props.values.filter(value => value !== option);
			props.onChange(updatedValues);
		}
	};

	const handleNoneSelection = (event): void => {
		if (event.target.checked) {
			props.onChange([NONE]);
			return;
		}

		props.onChange([]);
	};

	return (
		<div className="checkbox-group">
			<span className="checkbox-group__label">{ props.title }</span>
			<FormGroup>
				<div className="checkbox-row">
					{
						props.includeNoneOption && (
							<FormControlLabel
								key={ NONE }
								control={ <Checkbox /> }
								label={ NONE }
								checked={ props.values.includes(NONE) }
								onChange={ handleNoneSelection}
							/>
						)
					}
					{
						props.options.map((option) => (
							<FormControlLabel
								key={ option }
								control={ <Checkbox /> }
								label={ option }
								checked={ props.values.includes(option) }
								onChange={ (event) => handleSelection(event, option) }
							/>
						))
					}
				</div>
			</FormGroup>
		</div>
	);
}
