import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
	  host: false, // true allows access from network
  	  port: 5500,
  	  allowedHosts: ["localhost", "tdesa.duckdns.org"]}
})
