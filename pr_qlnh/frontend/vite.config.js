import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // Plugin cho Tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Tích hợp Tailwind trực tiếp
  ],
  define: {
    // Thiết lập global thành một đối tượng rỗng cho môi trường build/dev
    global: '({})' 
  },
});