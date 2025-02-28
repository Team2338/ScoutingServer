import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';
import {
	serviceWorkerInstalled,
	store
} from './state';
import './index.scss';
import { BrowserRouter } from 'react-router';
import { register } from './ServiceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<Provider store={ store }>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);

register({
	onUpdate: sw => store.dispatch(serviceWorkerInstalled(sw)),
	onSuccess: () => {
		window.location.reload();
	}
});
