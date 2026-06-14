import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../Views/MainView.vue'
import ArticuloView from '../Views/ArticuloView.vue'
import NuevoProductoView from '../Views/NuevoProductoView.vue'

import userApi from '../components/userApi.vue'
import AuthLogin from '../components/auth/AuthLogin.vue'
import AuthRegistro from '../components/auth/AuthRegistro.vue'


const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/articulo/:id', name: 'articulo', component: ArticuloView, props: true },
  { path: '/nuevo-articulo', name: 'nuevo-articulo', component: NuevoProductoView },
  { path: '/users', name: 'users', component: userApi },
  { path: '/login', name: 'login', component: AuthLogin },
  { path: '/registro', name: 'registro', component: AuthRegistro }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router