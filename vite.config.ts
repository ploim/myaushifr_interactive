import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Деплой в подпуть https://polytech-profile.ru/interactive/
  base: '/interactive/',
  plugins: [react()],
})
