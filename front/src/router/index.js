import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../Views/MainView.vue'
import ArticuloView from '../Views/ArticuloView.vue'
import ResultadosBusquedaView from '../Views/ResultadosBusquedaView.vue'
import NuevoProductoView from '../Views/NuevoProductoView.vue'
import userApi from '../components/userApi.vue'
import AuthLogin from '../components/auth/AuthLogin.vue'
import AuthRegistro from '../components/auth/AuthRegistro.vue'
import PerfilView from '../Views/PerfilView.vue'
import HistorialView from '../Views/HistorialView.vue'
import MisArticulosView from '../Views/MisArticulosView.vue'
import AjustesView from '../Views/AjustesView.vue'
import ChatView from '../Views/ChatView.vue'
import { useAuthStore } from '../stores/authStore.js'

const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/articulo/:id', name: 'articulo', component: ArticuloView, props: true },
  { path: '/buscar', name: 'buscar', component: ResultadosBusquedaView },
  { path: '/nuevo-articulo', name: 'nuevo-articulo', component: NuevoProductoView, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: userApi },
  { path: '/login', name: 'login', component: AuthLogin },
  { path: '/registro', name: 'registro', component: AuthRegistro },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { requiresAuth: true } },
  { path: '/historial', name: 'historial', component: HistorialView, meta: { requiresAuth: true } },
  { path: '/mis-articulos', name: 'mis-articulos', component: MisArticulosView, meta: { requiresAuth: true } },
  { path: '/ajustes', name: 'ajustes', component: AjustesView, meta: { requiresAuth: true } },
  { path: '/chat', name: 'chat', component: ChatView, meta: { requiresAuth: true } },
  { path: '/mensajes', redirect: '/chat' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router