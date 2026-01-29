import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    proxy: {
      '/api': {
        target: 'https://socialmedia-project-backend.onrender.com',
        changeOrigin: true,
        secure: false
      },
    },
    historyApiFallback: true,
  },
});
