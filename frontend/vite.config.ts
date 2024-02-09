import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	// depending on your application, base can also be "/"
	base: '',
	plugins: [react({
		jsxImportSource: '@emotion/react',
		babel: {
			plugins: ['@emotion/babel-plugin'],
		},
	})],
	build: {
		outDir: 'build'
	},
	server: { // Settings for dev server
		open: true, // Open the browser automatically
		port: 3000
	}
});
