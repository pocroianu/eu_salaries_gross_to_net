import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  base: '/eu_salaries_gross_to_net/',
  build: {
    // Disable source maps in production to prevent 404 errors
    sourcemap: false
  }
})
