import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../Views/MainView.vue'
import ArticuloView from '../Views/ArticuloView.vue'
import OpcionesLog from '../Views/OpcionesLog.vue'
import userApi from '../components/userApi.vue'

const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/articulo', name: 'articulo', component: ArticuloView },
  { path: '/opciones-login', name: 'opciones-log', component: OpcionesLog },
  { path: '/users', name: 'users', component: userApi }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router