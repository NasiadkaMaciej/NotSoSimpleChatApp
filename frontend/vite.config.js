import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		// ToDo: Is localhost needed?
		// ToDo: ENV for port
		port: 3005,
		allowedHosts: ['http://127.0.0.1:3005', 'front.nasiadka.pl']
	}
})
