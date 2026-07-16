import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import conectarApi from '../services/api'
import { connectSendbird, disconnectSendbird } from '../services/sendbirdClient'

export const useAuthStore = defineStore('auth', () => {

  const savedUser = localStorage.getItem('user')

  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const isLoading = ref(false)
  const isAuthChecked = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')

  const registerUser = async (name, email, password, rol) => {
    isLoading.value = true
    try {
      await conectarApi.post('/api/usuarios/register', {
        Nombre: name,
        Email: email,
        Password: password,
        Rol: rol
      })
    } finally {
      isLoading.value = false
    }
  }

  const loginUser = async (email, password) => {
    isLoading.value = true
    try {
      const response = await conectarApi.post('/api/usuarios/login', {
        email: email,
        password: password,
      })

      const userData = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.nombre
      }

      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))

      await connectSendbird(userData.id, userData.name)

      return true
    } catch (error) {
      console.error("Error al iniciar sesión: ", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // IMPORTANTE: esta función se llama en main.js ANTES de montar la app,
  // incluyendo cada vez que la SPA se reinicia por un reload completo
  // (por ejemplo al volver de Stripe con window.location.href).
  //
  // Solo debe destruir la sesión local si el backend responde
  // explícitamente 401 (sesión realmente inválida/expirada). Cualquier
  // otro error -timeout, red caída, o el backend de Railway despertando
  // de un cold start- NO debe borrar una sesión local que ya era válida.
  // Antes, cualquier error acá tiraba al usuario a /login sin motivo real.
  const checkAuthToken = async () => {
    try {
      const response = await conectarApi.get('/api/auth/me')
      const userData = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.nombre
      }
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))

      await connectSendbird(userData.id, userData.name)

      return true
    } catch (error) {
      if (error.response?.status === 401) {
        // Sesión realmente inválida/expirada: sí hay que desloguear.
        user.value = null
        localStorage.removeItem('user')
      } else {
        // Error de red, timeout, 5xx, backend despertando, etc.
        // Mantenemos la sesión local tal cual estaba; no es un logout real.
        console.warn(
          'No se pudo verificar la sesión con el backend (se mantiene la sesión local):',
          error.message
        )
      }
      return false
    } finally {
      isAuthChecked.value = true
    }
  }

  const logout = () => {
    conectarApi.post('/api/usuarios/logout').catch(() => {})
    disconnectSendbird()
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, isLoading, isLoggedIn, isAuthChecked, checkAuthToken, userEmail, registerUser, loginUser, logout }
})