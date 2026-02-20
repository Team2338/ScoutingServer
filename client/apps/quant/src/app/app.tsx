import { useState } from 'react';
import LoginPage from '../components/login-page/LoginPage';
import { ICredentials } from '../models/models';
import DataCollectionPage from '../components/data-collection-page/DataCollectionPage';

export function App() {
	const [credentials, setCredentials] = useState<ICredentials | null>(null);

	const content = credentials
		? (<DataCollectionPage />)
		: (<LoginPage handleSubmit={ setCredentials } />);

	return (
		<div>
			{ content }
		</div>
	);
}

export default App;
