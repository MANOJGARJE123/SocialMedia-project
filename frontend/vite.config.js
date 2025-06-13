import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
      },
    },
    // ✅ This line handles React Router routes like /login, /register
    historyApiFallback: true,
  },
});
