import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pgPlugin from '@pinegrow/vite-plugin'


const Pinegrow = pgPlugin.liveDesigner

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pinegrow() 
  ],
})