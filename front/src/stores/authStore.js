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

  const registerUser = async (name, email, password) => {
    isLoading.value = true
    try {
      await conectarApi.post('/api/usuarios/register', {
        Nombre: name,
        Email: email,
        Password: password,
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
      return true
    } catch (error) {
      user.value = null
      localStorage.removeItem('user')
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