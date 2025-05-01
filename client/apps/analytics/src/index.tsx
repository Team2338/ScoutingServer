import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './components/App';
import { store } from './state';
import { myRegister, unregister } from './serviceWorkerRegistration';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { orange } from '@mui/material/colors';
import { BLUE, BLUE_PALETTE } from './models';

const theme = createTheme({
	colorSchemes: {
		dark: {
			palette: {
				primary: BLUE_PALETTE,
				secondary: orange,
				background: {
					default: '#18191b'
				}
			},
		}
	},
	palette: {
		primary: BLUE_PALETTE,
		secondary: orange
	}
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<Provider store={ store }>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline/>
				<App/>
			</ThemeProvider>
		</BrowserRouter>
	</Provider>
);

myRegister();
// unregister();
