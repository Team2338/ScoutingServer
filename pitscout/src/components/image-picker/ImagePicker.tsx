import React, { useEffect, useRef } from 'react';
import './ImagePicker.scss';
import { Typography } from '@mui/material';

interface IProps {
	label: string;
	helperText: string;
	isError: boolean;
	file: File,
	setFile: (file: File) => void
}

export default function ImagePicker(props: IProps) {
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (props.file === null) {
			fileInputRef.current.value = null;
		}
	}, [props.file]);

	return (
		<div className="image-picker">
			<label className={ 'file-input-label' + (props.isError ? ' error' : '') }>
				<input
					ref={ fileInputRef }
					className="file-input-vanilla"
					type="file"
					accept="image/jpeg, image/jpg, image/png"
					onChange={ event => { props.setFile(event.target.files[0])} }
					aria-invalid={ props.isError }
				/>
				<div className="file-input-prompt">{ props.label }</div>
				<div className="file-input-selection">
					{ props.file ? props.file.name : 'No image selected'}
				</div>
			</label>
			<Typography
				variant="caption"
				component="div"
				color={ props.isError ? 'error' : '#00000099' }
				id={ props.isError ? 'file-input-error-text' : 'file-input-helper-text' }
				role={ props.isError ? 'alert' : null }
				aria-label={ props.helperText }
				sx={{ paddingLeft: '8px' }}
			>
				{ props.helperText }
			</Typography>
		</div>
	);
}
