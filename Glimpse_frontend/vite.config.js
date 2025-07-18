import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss() , react()],
  server: {
    port: parseInt(process.env.VITE_PORT) || 5181,
    strictPort: false, // Allow Vite to automatically shift to the next available port
  },
})
