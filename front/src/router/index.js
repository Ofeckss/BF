import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../Views/MainView.vue'
import ArticuloView from '../Views/ArticuloView.vue'
import OpcionesLog from '../Views/OpcionesLog.vue'

const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/articulo', name: 'articulo', component: ArticuloView },
  { path: '/opciones-login', name: 'opciones-log', component: OpcionesLog }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router