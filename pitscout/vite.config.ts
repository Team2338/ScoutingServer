import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
	// depending on your application, base can also be "/"
	base: '',
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin'],
			},
		}),
		checker({
			typescript: true
		}),
		eslintPlugin({
			cache: false,
			include: ['./src/**/*.ts', './src/**/*.tsx']
		})
	],
	build: {
		outDir: 'build',
		// rollupOptions: {
		// 	input: {
		// 		app: './index.html',
		// 		'service-worker': './src/service-worker.ts',
		// 	},
		// 	output: {
		// 		entryFileNames: assetInfo => {
		// 			return assetInfo.name === 'service-worker'
		// 				? '[name].js'
		// 				: 'assets/js/[name]-[hash].js'
		// 		},
		// 	}
		// }
	},
	server: { // Settings for dev server
		open: true, // Open the browser automatically
		port: 3000
	}
});
