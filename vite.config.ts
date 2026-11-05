import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Деплой в подпуть https://politech-profile.ru/interactive/
  base: '/interactive/',
  plugins: [react()],
})
