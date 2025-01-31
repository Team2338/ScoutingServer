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
	onChange: (values: string[]) => void;
}

export default function CheckboxGroup(props: IProps) {

	const handleSelection = (event, option: string): void => {
		if (event.target.checked && !props.values.includes(option)) {
			props.onChange([...props.values, option]);
			return;
		}

		if (!event.target.checked && props.values.includes(option)) {
			const updatedValues: string[] = props.values.filter(value => value !== option);
			props.onChange(updatedValues);
		}
	};

	return (
		<div className="checkbox-group">
			<span className="checkbox-group__label">{ props.title }</span>
			<FormGroup>
				<div className="checkbox-row">
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
