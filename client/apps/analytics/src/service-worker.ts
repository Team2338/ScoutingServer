/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */


export default {}; // Just to make this an ES module

const version: string = 'v2';
const expectedCaches: string[] = ['gs-analytics_v1'];
const cachePrefix: string = 'gs-analytics';

// ###################################
// # START - Static content to cache #
// ###################################

const images: string[] = [
	'/assets/NoData.svg',
	'/logos/32-favicon.png',
	'/logos/128-favicon.png',
	'/logos/192-pwa.png',
	'/logos/512-android-splash.png'
];

// #################################
// # END - Static content to cache #
// #################################

// ############################
// # START - Lifecycle events #
// ############################

// Performed on retrieval of this service worker; it is not yet active
self.addEventListener('install', (event: ExtendableEvent) => {
	console.log(`Installing service worker ${version}...`);

	// Cache static files
	event.waitUntil(
		caches.open('gs-analytics_v1')
			.then((cache: Cache) => cache.addAll(images))
	);
});

// This runs after this service worker version has taken control of the page
self.addEventListener('activate', (event: ExtendableEvent) => {
	console.log(`Activating service worker ${version}...`);

	// Delete all unrecognized caches that match our prefix
	event.waitUntil(
		caches.keys().then((keys: string[]) => Promise.all(
			keys.map((key: string) => {
				if (expectedCaches.includes(key) || !key.startsWith(cachePrefix)) {
					return;
				}

				caches.delete(key);
			})
		)).then(() => {
			console.log(`Activated service worker ${version}`);
		})
	);
});

// ##########################
// # END - Lifecycle events #
// ##########################

/**
 * Intercept requests
 */
self.addEventListener('fetch', (event: FetchEvent) => {
	const url: URL = new URL(event.request.url);

	// Ignore requests for data
	if (url.pathname.startsWith('/api/')) {
		return;
	}

	// Ignore localhost
	if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
		return;
	}

	// Ignore cross-site requests
	if (url.origin !== location.origin) {
		return;
	}

	if (images.includes(url.pathname)) {
		console.log(`Cache hit ${url.pathname}`);
		event.respondWith(caches.match(event.request));
		return;
	}

	return;
	// event.respondWith(
	// 	fetch(event.request)
	// );
});
