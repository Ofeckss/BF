import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../Views/MainView.vue'
import ArticuloView from '../Views/ArticuloView.vue'
import AuthLogin from '../components/auth/AuthLogin.vue'
import AuthRegistro from '../components/auth/AuthRegistro.vue'


const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/articulo', name: 'articulo', component: ArticuloView },
  { path: '/login', name: 'login', component: AuthLogin },
  { path: '/registro', name: 'registro', component: AuthRegistro }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router