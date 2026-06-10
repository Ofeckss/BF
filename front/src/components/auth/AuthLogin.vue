<!-- src/components/auth/AuthLogin.vue -->
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

defineEmits(['cambiarVista'])

const router = useRouter()
const auth = useAuthStore()

const loginForm = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  if (loginForm.email) {
    auth.loginUser(loginForm.email)
    router.push('/')
  }
}
</script>

<template>
  <div class="view-fade">
    <h1 class="logo-title">Bartify</h1>
    <p class="subtitle">Inicia Sesion para continuar</p>
    
    <form @submit.prevent="handleLogin" class="form-layout">
      <div class="input-container">
        <label class="form-label">Correo Electronico</label>
        <input type="email" v-model="loginForm.email" class="form-input" required />
      </div>
      
      <div class="input-container">
        <label class="form-label">Contraseña</label>
        <input type="password" v-model="loginForm.password" class="form-input" required />
      </div>
      
      <button type="submit" class="btn-orange">Iniciar Sesion</button>
    </form>
    
    <p class="forgot-password">Olvidaste tu Contraseña?</p>
    
    <div class="divider-container">
      <div class="line"></div>
      <span class="divider-text">O</span>
      <div class="line"></div>
    </div>
    
    <p @click="$emit('cambiarVista', 'registro')" class="switch-view-link">
      No tienes cuenta? Registrate
    </p>
  </div>
</template>

<style scoped>
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
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333333;
  padding-left: 4px;
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

.btn-orange:hover {
  background-color: var(--brand-orange);
}

.forgot-password {
  text-align: center;
  color: #333333;
  font-size: 0.95rem;
  margin: 20px 0 10px 0;
  cursor: pointer;
}

.switch-view-link {
  text-align: center;
  color: #222222;
  font-size: 1.05rem;
  cursor: pointer;
  margin: 15px 0 0 0;
}

.switch-view-link:hover {
  text-decoration: underline;
  color: var(--brand-orange);
}

.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
}

.line {
  flex: 1;
  height: 2px;
  background-color: #FF623E;
  opacity: 0.5;
}

.divider-text {
  padding: 0 15px;
  color: #222222;
  font-weight: bold;
}

.view-fade {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>