import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
<<<<<<< HEAD

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
=======
import path from 'path'

export default defineConfig({
  plugins: [
    vue() 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
>>>>>>> 2130a6a924263eef4fe329b66365c02b2a780953
})