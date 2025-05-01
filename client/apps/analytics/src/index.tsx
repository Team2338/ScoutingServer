import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './components/App';
import { store } from './state';
import { myRegister, unregister } from './serviceWorkerRegistration';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { orange } from '@mui/material/colors';

const myBlue = {
	900: '#254999',
	800: '#2f67b9',
	700: '#3478cb',
	600: '#3b8ade',
	500: '#4198eb',
	400: '#55a7ef',
	300: '#70b6f1',
	200: '#96cbf6',
	100: '#bedff9',
	50: '#e4f2fc'
}

const theme = createTheme({
	colorSchemes: {
		dark: {
			palette: {
				primary: myBlue,
				secondary: orange,
				background: {
					default: '#18191b'
				}
			},
		}
	},
	palette: {
		primary: {
			main: myBlue[900],
			light: myBlue[500]
		},
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
