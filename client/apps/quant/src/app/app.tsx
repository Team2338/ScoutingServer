import { useState } from 'react';
import LoginPage from '../components/login-page/LoginPage';
import { ICredentials, IMatch } from '../models/models';
import DataCollectionPage from '../components/data-collection-page/DataCollectionPage';

export function App() {
	const [credentials, setCredentials] = useState<ICredentials | null>(null);

	const submitMatchData = (match: IMatch): void => {
		console.log('Submitting match data', match);
		// TODO: send match
	}

	if (credentials) {
		return (
			<div className="app">
				<LoginPage handleSubmit={ setCredentials } />
			</div>
		);
	}

	return (
		<div className="app">
			<DataCollectionPage credentials={ credentials } handleSubmit={ submitMatchData } />
		</div>
	);
}

export default App;
