/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
import { PrecacheEntry } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

const precacheManifest = self.__WB_MANIFEST;
console.log('precache', precacheManifest);
const precacheUrls: string[] = precacheManifest.map((x: PrecacheEntry) => x.url);

const version = import.meta.env.VITE_APP_VERSION;
const cachePrefix = 'gs-analytics';
const cacheName = `${cachePrefix}_${version}`;

self.addEventListener('install', (event: ExtendableEvent) => {
	console.log(`Installing service worker ${version}...`);

	// TODO: Put the necessary PWA files in persistent storage
	event.waitUntil(
		caches.open(cacheName)
			.then((cache: Cache) => cache.addAll(precacheUrls))
			.then(() => console.log(`Finished installing ${version}`))
	);
});

self.addEventListener('activate', (event: ExtendableEvent) => {
	console.log(`Activating service worker ${version}...`);

	// Delete all old caches matching our prefix
	event.waitUntil(
		caches.keys()
			.then((keys: string[]) => {
				keys.forEach((key: string) => {
					if (key.startsWith(cachePrefix) && key !== cacheName) {
						caches.delete(key);
					}
				});
			})
			.then(() => console.log(`Activated service worker ${version}`))
	);
});

self.addEventListener('fetch', (event: FetchEvent) => {
	const url: URL = new URL(event.request.url);

	if (precacheUrls.includes(url.pathname)) {
		// TODO: respond with web request if cache misses
		// A device can decide to free up the cache at any time if memory pressure is high
		event.respondWith(caches.match(event.request));
		return;
	}

	return;
});
