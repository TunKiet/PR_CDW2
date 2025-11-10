import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // Thiết lập global thành một đối tượng rỗng cho môi trường build/dev
    global: '({})' 
  },
});