import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './components/App';
import { store } from './state';
import { myRegister, unregister } from './serviceWorkerRegistration';
import { createTheme, ThemeProvider } from '@mui/material';
import { orange } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		primary: {
			main: '#254999'
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
				<App/>
			</ThemeProvider>
		</BrowserRouter>
	</Provider>
);

myRegister();
// unregister();
