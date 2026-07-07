import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/authStore.js'

const app = createApp(App)
const pinia = createPinia() 

app.use(pinia)
app.use(router)

const auth = useAuthStore()
await auth.checkAuthToken()

app.mount('#app')