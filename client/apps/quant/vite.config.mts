/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
	root: import.meta.dirname,
	cacheDir: '../../node_modules/.vite/apps/quant',
	server: {
		port: 4200,
		host: 'localhost',
	},
	preview: {
		port: 4200,
		host: 'localhost',
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
	//   plugins: () => [ nxViteTsPaths() ],
	// },
	build: {
		outDir: '../../_build/quant',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		// rollupOptions: {
		// 	input: {
		// 		app: './index.html',
		// 		'service-worker': './src/service-worker.ts',
		// 	},
		// 	output: {
		// 		entryFileNames: (asset) => {
		// 			if (asset.name === 'service-worker') {
		// 				return '[name].js';
		// 			}
		//
		// 			return 'assets/js/[name]-[hash].js';
		// 		}
		// 	}
		// }
	},
}));
