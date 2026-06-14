<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  isLoading.value = true 
  try {
    await auth.loginUser(loginForm.email, loginForm.password)
    router.push('/')
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    alert("Credenciales incorrectas o servidor no disponible")
  } finally {
    isLoading.value = false 
  }
}
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card view-fade">
      <h1 class="logo-title">Bartify</h1>
      <p class="subtitle">Inicia Sesión para continuar</p>
      
      <form @submit.prevent="handleLogin" class="form-layout">
        <div class="input-container">
          <label class="form-label">Correo Electrónico</label>
          <input type="email" v-model="loginForm.email" class="form-input" required />
        </div>
        
        <div class="input-container">
          <label class="form-label">Contraseña</label>
          <input type="password" v-model="loginForm.password" class="form-input" required />
        </div>
        
        <button 
          type="submit" 
          class="btn-orange" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="switch-view-link" @click="router.push('/registro')">
        ¿No tienes cuenta? Regístrate aquí
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 40px 20px;
  box-sizing: border-box;
}

.auth-card {
  background-color: #FFFFFF;
  border-radius: 32px;
  border: 4px solid var(--brand-brown);
  padding: 45px 35px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
}

.logo-title {
  text-align: center;
  font-size: 3rem;
  color: var(--brand-orange);
  margin: 0 0 12px 0;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  color: #555555;
  margin: 0 0 35px 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: bold;
  color: var(--brand-brown);
  font-size: 0.95rem;
}

.form-input {
  background-color: var(--brand-dark-gray);
  border: 3px solid var(--brand-brown);
  border-radius: 20px;
  padding: 14px 18px;
  font-size: 1.05rem;
  color: #FFFFFF;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--brand-orange);
}

.btn-orange {
  background-color: #FF623E;
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-orange:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.btn-orange:hover:not(:disabled) {
  background-color: var(--brand-orange);
}

.switch-view-link {
  text-align: center;
  color: var(--brand-orange);
  margin-top: 20px;
  cursor: pointer;
  font-weight: bold;
}

.switch-view-link:hover {
  text-decoration: underline;
}
</style>