import { defineStore } from 'pinia'
import { ref } from 'vue'
import conectarApi from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const savedUser = localStorage.getItem('user')
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const isLoading = ref(false)

  const registerUser = async (name, email, password) => {
    isLoading.value = true
    try {
      await conectarApi.post('/auth/register', {
        Nombre: name,
        Correo: email,
        Password: password,
      })
    } finally {
      isLoading.value = false
    }
  }

  const loginUser = async (email, password) => {
    isLoading.value = true
    try {
      const response = await conectarApi.post('/auth/login', {
        Correo: email,
        Password: password,
      })
      const userData = {
        email: response.data.correo,
        name: response.data.nombre,
        id: response.data.id
      }
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Error al iniciar sesión: ", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, isLoading, registerUser, loginUser, logout }
})