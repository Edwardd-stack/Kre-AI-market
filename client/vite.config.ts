import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,       // Starbelly 5173'da — to'qnashmasligi uchun
    strictPort: true, // band bo'lsa boshqa portga sakramaydi, xato beradi
  },
})
