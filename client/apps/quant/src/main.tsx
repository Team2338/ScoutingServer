import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { createTheme, Theme, ThemeProvider } from '@mui/material';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';


const ORANGE = '#FE5000';
const ORANGE_HOVER = '#FE7755';
const OFFWHITE = '#FAF9F6';

const customTheme: Theme = createTheme({
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					'& label.Mui-focused': {
						color: ORANGE
					}
				}
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				notchedOutline: {
					borderColor: OFFWHITE
				},
				root: {
					[`&:hover .${outlinedInputClasses.notchedOutline}`]: {
						borderColor: ORANGE_HOVER
					},
					[`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
						borderColor: ORANGE
					},
					[`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
						borderColor: OFFWHITE,
						opacity: 0.6
					}
				}
			}
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: OFFWHITE
				}
			}
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					color: OFFWHITE,
					textAlign: 'right'
				}
			}
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					color: OFFWHITE,
				},
				icon: {
					color: OFFWHITE,
					'&.Mui-disabled': {
						color: OFFWHITE
					}
				}
			}
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					'&.Mui-focused': {
						color: ORANGE
					}
				}
			}
		}
	}
});

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<ThemeProvider theme={ customTheme }>
		<App />
	</ThemeProvider>
);
