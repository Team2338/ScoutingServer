
export const register = async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registration: ServiceWorkerRegistration = await navigator.serviceWorker
				.register('/service-worker.js', {
					type: 'module'
				});
		} catch (error) {
			console.error('Service worker registration error', error);
		}
	}
};

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
