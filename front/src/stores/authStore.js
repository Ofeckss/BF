
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const isLoggedIn = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email || '')

  const loginUser = (email, name = '') => {
    user.value = { email, name }
  }

  const logoutUser = () => {
    user.value = null
  }

  return { 
    user, 
    isLoggedIn, 
    userEmail, 
    loginUser, 
    logoutUser 
  }
})