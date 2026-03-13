import './CycleEstimator.scss';
import React, { useState } from 'react';
import { ClimbLevel, CycleSize, ICycle } from '../../../models/models';
import { FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface IProps {
	className?: string;
	gamemode: string;
	cycles: ICycle[];
	setCycles: (cycles: ICycle[]) => void;
}

const accuracies = [0, 25, 50, 75, 95, 100];

export default function CycleEstimator(props: IProps) {
	const [selectedAccuracy, setSelectedAccuracy] = useState<number>(null);
	const [size, setSize] = useState<CycleSize | ''>('');

	const previousCycle = props.cycles.at(-1);
	const lowercaseGamemode = props.gamemode.toLowerCase();
	const isValid = Boolean(size) && selectedAccuracy !== null;

	const addCycle = () => {
		const cycle: ICycle = {
			size: size as CycleSize,
			accuracy: selectedAccuracy
		};
		setSelectedAccuracy(null);
		setSize('');
		props.setCycles(props.cycles.concat(cycle));
	};

	const setPreviousAccuracy = (accuracy: number) => {
		const copy: ICycle[] = props.cycles.slice();
		copy.at(-1).accuracy = accuracy;
		props.setCycles(copy);
	};

	const setPreviousSize = (size: CycleSize) => {
		const copy: ICycle[] = props.cycles.slice();
		copy.at(-1).size = size;
		props.setCycles(copy);
	};

	return (
		<div className={ 'cycle-estimator ' + props.className }>
			{
				previousCycle && (
					<div className="previous-cycle-wrapper">
						<h3 className="objective-title">Previous { props.gamemode } Cycle</h3>
						<div id={ lowercaseGamemode + '-cycle-previous-accuracy-label' } className="accuracy-label">Accuracy</div>
						<ToggleButtonGroup
							id={ lowercaseGamemode + '-cycle-previous-accuracy' }
							className="toggle-button-group"
							aria-labelledby={ lowercaseGamemode + '-cycle-previous-accuracy-label' }
							value={ selectedAccuracy }
							defaultValue={ ClimbLevel.none }
							exclusive
							onChange={ (event, newValue) => setPreviousAccuracy(newValue ?? previousCycle.accuracy) }
						>
							{
								accuracies.map((accuracy: number) => (
									<ToggleButton
										key={ accuracy }
										className="toggle-button round"
										value={ accuracy }
										selected={ accuracy === previousCycle.accuracy }
										onClick={ () => setPreviousAccuracy(accuracy) }
									>
										{ accuracy }%
									</ToggleButton>
								))
							}
						</ToggleButtonGroup>
						<FormControl margin="normal">
							<InputLabel id={ lowercaseGamemode + '-cycle-previous-size-label' }>Estimated size</InputLabel>
							<Select
								id={ lowercaseGamemode + '-cycle-previous-size-dropdown' }
								labelId={ lowercaseGamemode + '-cycle-previous-size-label' }
								label="Estimated size"
								variant="outlined"
								value={ previousCycle.size }
								onChange={ (event) => setPreviousSize(event.target.value) }
								sx={{ width: 'calc(10em + 28px)' }}
							>
								<MenuItem value={ CycleSize.small }>1-10</MenuItem>
								<MenuItem value={ CycleSize.medium }>11-25</MenuItem>
								<MenuItem value={ CycleSize.large }>26+</MenuItem>
							</Select>
						</FormControl>
					</div>
				)
			}
			<h3 className="objective-title">Current { props.gamemode } Cycle</h3>
			<div id={ lowercaseGamemode + '-cycle-current-accuracy-label' } className="accuracy-label">Accuracy</div>
			<ToggleButtonGroup
				id={ lowercaseGamemode + '-cycle-current-accuracy' }
				className="toggle-button-group"
				aria-labelledby={ lowercaseGamemode + '-cycle-current-accuracy-label' }
				value={ selectedAccuracy }
				defaultValue={ ClimbLevel.none }
				exclusive
				onChange={ (event, newValue) => setSelectedAccuracy(newValue ?? selectedAccuracy) }
			>
				{
					accuracies.map((accuracy: number) => (
						<ToggleButton
							key={ accuracy }
							className="toggle-button round"
							value={ accuracy }
							selected={ accuracy === selectedAccuracy }
							onClick={ () => setSelectedAccuracy(accuracy) }
						>
							{ accuracy }%
						</ToggleButton>
					))
				}
			</ToggleButtonGroup>
			<FormControl margin="normal">
				<InputLabel id={ lowercaseGamemode + '-cycle-current-size-label' }>Estimated size</InputLabel>
				<Select
					id={ lowercaseGamemode + '-cycle-current-size-dropdown' }
					labelId={ lowercaseGamemode + '-cycle-current-size-label' }
					label="Estimated size"
					variant="outlined"
					value={ size }
					onChange={ (event) => setSize(event.target.value) }
					sx={{ width: 'calc(10em + 28px)' }}
				>
					<MenuItem value="">None</MenuItem>
					<MenuItem value={ CycleSize.small }>1-10</MenuItem>
					<MenuItem value={ CycleSize.medium }>11-25</MenuItem>
					<MenuItem value={ CycleSize.large }>26-40</MenuItem>
					<MenuItem value={ CycleSize.extraLarge }>41+</MenuItem>
				</Select>
			</FormControl>
			<button
				className="add-cycle-button gif-button-primary"
				onClick={ addCycle }
				disabled={ !isValid }
			>
				Add Cycle
			</button>
			<div className="cycle-count">{ props.gamemode } cycles: { props.cycles.length }</div>
		</div>
	);
}
