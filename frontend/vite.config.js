import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		// ToDo: ENV for port
		port: 3005,
		allowedHosts: ['front.nasiadka.pl']
	}
})
