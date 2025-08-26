import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  server:{
 host: '0.0.0.0', // listen on all network interfaces (important for ngrok)
    port: 5173,
    strictPort: true,
    allowedHosts: ['http://localhost:5173'],

    proxy:{
      '/api' : 'http://localhost:3000' 
    },
  },
 plugins: [react()],
  test: {
    environment: 'jsdom',  // ✅ Simulates browser environment
    globals: true,  
       // ✅ Enables global test(), expect(), etc.
  },
  
})
