import { useEffect, useState } from 'react';
import LoginPage from '../components/login-page/LoginPage';
import { ICredentials, IMatch, IMatchLineup } from '../models/models';
import DataCollectionPage from '../components/data-collection-page/DataCollectionPage';
import UpdateBanner from '../components/update-banner/UpdateBanner';
import { gearscoutService } from '../services/GearscoutService';
import { registerServiceWorker } from '../ServiceWorkerRegistration';

export function App() {
	const [credentials, setCredentials] = useState<ICredentials | null>(null);
	const [scheduleIsLoading, setScheduleIsLoading] = useState<boolean>(false);
	const [schedule, setSchedule] = useState<IMatchLineup[] | null>(null);

	const [hasUpdate, setHasUpdate] = useState<boolean>(false);
	const [serviceWorker, setServiceWorker] = useState<ServiceWorker>(null);

	// Listen for updates on app init
	useEffect(() => {
		registerServiceWorker({
			onUpdate: (sw: ServiceWorker) => {
				setHasUpdate(true);
				setServiceWorker(sw);
			},
			onSuccess: () => {
				window.location.reload();
			}
		});
	}, []);

	const submitMatchData = (match: IMatch): void => {
		console.log('Submitting match data', match);
		gearscoutService.submitMatch(credentials, match)
			.then(response => {
				console.log('Match data submitted successfully', response);
			})
			.catch(error => {
				console.error('Error submitting match data', error);
			});
	};

	const handleLogin = (credentials: ICredentials): void => {
		setCredentials(credentials);

		if (credentials.tbaCode.trim().length === 0) {
			return;
		}

		setScheduleIsLoading(true);
		gearscoutService.getEventSchedule(2026, credentials.tbaCode)
			.then((response) => {
				const res: IMatchLineup[] = response.data;
				console.log('Got schedule', res);
				setSchedule(res);
				setScheduleIsLoading(false);
			})
			.catch((error) => {
				setScheduleIsLoading(false);
				console.error('Failed to get schedule', error);
			});
	};

	if (credentials) {
		return (
			<div className="app">
				<UpdateBanner hasUpdate={ hasUpdate } serviceWorker={ serviceWorker } />
				<DataCollectionPage
					credentials={ credentials }
					schedule={ schedule }
					scheduleIsLoading={ scheduleIsLoading }
					handleSubmit={ submitMatchData }
				/>
			</div>
		);
	}

	return (
		<div className="app">
			<UpdateBanner hasUpdate={ hasUpdate } serviceWorker={ serviceWorker } />
			<LoginPage handleSubmit={ handleLogin } />
		</div>
	);
}

export default App;
