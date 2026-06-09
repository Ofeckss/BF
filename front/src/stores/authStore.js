import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userEmail = ref('')

  const loginUser = (email) => {
    isLoggedIn.value = true
    userEmail.value = email
  }

  const logoutUser = () => {
    isLoggedIn.value = false
    userEmail.value = ''
  }

  return { isLoggedIn, userEmail, loginUser, logoutUser }
})