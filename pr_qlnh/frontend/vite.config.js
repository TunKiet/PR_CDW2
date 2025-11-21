import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // Plugin cho Tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Tích hợp Tailwind trực tiếp
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    fs: {
      allow: ['.'],
    },
  },
  base: '/',
});