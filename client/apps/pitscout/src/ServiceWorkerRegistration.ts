
interface IConfig {
	onUpdate?: (sw: ServiceWorker) => void;
	onSuccess?: (sw: ServiceWorker) => void;
}

export const register = async (config?: IConfig) => {
	window.addEventListener('load', async () => {
		if ('serviceWorker' in navigator) {
			try {
				const registration: ServiceWorkerRegistration = await navigator.serviceWorker
					.register('/service-worker.js', {
						type: 'module'
					});

				listenForUpdatedWorkerDownload(registration, config);
				listenForWorkerActivation(registration, config);
			} catch (error) {
				console.error('Service worker registration error', error);
			}
		}
	});
};

function listenForUpdatedWorkerDownload(registration: ServiceWorkerRegistration, config: IConfig): void {
	// Fired any time the ServiceWorkerRegistration.installing property acquires a new service worker
	registration.onupdatefound = () => {
		const installingWorker: ServiceWorker = registration.installing;
		if (!installingWorker) {
			return;
		}

		installingWorker.onstatechange = () => {
			if (installingWorker.state === 'installed') {
				if (registration.active) {
					// There is one SW active and the next one just finished installing
					console.log('A new service worker is awaiting activation');
					config.onUpdate?.(installingWorker);
				} else {
					// Otherwise, this SW will activate immediately (first-time SW install)
					console.log('Content is cached for offline use');
				}
			}
		};
	};
}

function listenForWorkerActivation(registration: ServiceWorkerRegistration, config: IConfig): void {
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		config.onSuccess?.(registration.active);
	});
}

export function unregister(): void {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister();
			})
			.catch((error) => {
				console.error(error.message);
			});
	}
}
