import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { store } from './state';
import { myRegister, unregister } from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<Provider store={ store }>
		<BrowserRouter
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true
			}}
		>
			<App/>
		</BrowserRouter>
	</Provider>
);

myRegister();
// unregister();
