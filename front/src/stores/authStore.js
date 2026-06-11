import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const savedUser = localStorage.getItem('user')
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const isLoading = ref(false)

  const registerUser = async (name, email, password) => {
    isLoading.value = true
    try {
      await axios.post('http://localhost:5000/Usuarios', { 
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
      const response = await axios.get('http://localhost:5000/Usuarios')
      const usuarioEncontrado = response.data.find(u => u.correo === email)

      if (!usuarioEncontrado) {
        throw new Error("Usuario no encontrado")
      }

      const userData = { email: usuarioEncontrado.correo, name: usuarioEncontrado.nombre }
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      
      return true
    } catch (error) {
      console.error("Error al loguear:", error)
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