import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Không cần import tailwindcss ở đây, chỉ cần cấu hình trong postcss.config.js
export default defineConfig({
  plugins: [react()],
})
