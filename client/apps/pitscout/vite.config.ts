/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/apps/pitscout',
	server: {
		open: true,
		port: 3000,
		host: 'localhost',
	},
	preview: {
		port: 4300,
		host: 'localhost',
	},
	resolve: { // Added for @mui
		conditions: ['mui-modern', 'module', 'browser', 'development|production']
	},
	plugins: [
		react(),
		nxViteTsPaths(),
		nxCopyAssetsPlugin(['*.md']),
		VitePWA({
			injectRegister: null, // Manually register the service worker
			manifest: false,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			includeAssets: ['manifest.json', 'logos/*.{png,ico,svg,jpg,gif,webp}']
		})
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	css: { // TODO: Can remove this block after Vite 6 upgrade
		preprocessorOptions: {
			scss: {
				api: 'modern'
			}
		}
	},
	build: {
		outDir: '../../_build/pitscout',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	test: {
		watch: false,
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		reporters: ['default'],
		coverage: {
			reportsDirectory: '../../coverage/apps/pitscout',
			provider: 'v8',
		},
	}
});
