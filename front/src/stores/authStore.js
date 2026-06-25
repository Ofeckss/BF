import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import conectarApi from '../services/api'

export const useAuthStore = defineStore('auth', () => {

  const savedUser = localStorage.getItem('user')
  //const savedToken = localStorage.getItem('token')
  
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  //const token = ref(savedToken || null)
  const isLoading = ref(false)

  const isLoggedIn = computed(()=> !!user.value)
  const userEmail = computed(()=> user.value?.email || '')

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

      console.log('Respuesta del backend:', response.data)
      
      const userData = {
        email: response.data.correo, 
        name: response.data.nombre,
        id: response.data.id
      }

      user.value = userData
      //console.log(user.value)
      //token.value = receivedToken

      localStorage.setItem('user', JSON.stringify(userData))
      //localStorage.setItem('token', receivedToken)

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
    //token.value = null
    localStorage.removeItem('user')
    //localStorage.removeItem('token')
  }

  return { user, isLoading, isLoggedIn, userEmail, registerUser, loginUser, logout }
})