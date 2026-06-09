<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const vistaActual = ref('opciones')

const name = ref('')
const emailRegistro = ref('')
const passwordRegistro = ref('')

const emailLogin = ref('')
const passwordLogin = ref('')

const handleRegister = () => {
  console.log('Datos Registro:', { name: name.value, email: emailRegistro.value })
  auth.loginUser(emailRegistro.value)
  router.push('/') 
}

const handleLogin = () => {
  console.log('Datos Login:', { email: emailLogin.value })
  auth.loginUser(emailLogin.value)
  router.push('/') 
}
</script>

<template>
  <div class="auth-container">
    
    <div v-if="vistaActual === 'opciones'" class="auth-card">
      <h1 class="logo-title">Bartify</h1>
      <p class="subtitle">Compra, vende e intercambia con tus vecinos</p>
      
      <button @click="vistaActual = 'login'" class="btn-gris">
        Iniciar Sesion
      </button>
      
      <button @click="vistaActual = 'registro'" class="btn-gris">
        Crear Cuenta
      </button>
    </div>

    <div v-else-if="vistaActual === 'login'" class="auth-card">
      <h1 class="logo-title">Bartify</h1>
      <p class="subtitle">Inicia Sesion para continuar</p>
      
      <form @submit.prevent="handleLogin" class="form-inputs">
        <div class="input-group">
          <label>Correo Electronico</label>
          <input type="email" v-model="emailLogin" class="custom-input" required />
        </div>
        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" v-model="passwordLogin" class="custom-input" required />
        </div>
        <button type="submit" class="btn-naranja">Iniciar Sesion</button>
      </form>
      
      <p @click="vistaActual = 'registro'" class="switch-link">
        ¿No tienes cuenta? Registrate
      </p>
    </div>

    <div v-else-if="vistaActual === 'registro'" class="auth-card">
      <h1 class="logo-title">Únete a Bartify</h1>
      <p class="subtitle">Crea tu cuenta y empieza a vender o cambiar</p>
      
      <form @submit.prevent="handleRegister" class="form-inputs">
        <div class="input-group">
          <label for="name">Nombre: </label>
          <input type="text" id="name" v-model="name" class="custom-input" required />
        </div>
        <div class="input-group">
          <label for="email">Email: </label>
          <input type="email" id="email" v-model="emailRegistro" class="custom-input" required />
        </div>
        <div class="input-group">
          <label for="password">Contraseña: </label>
          <input type="password" id="password" v-model="passwordRegistro" class="custom-input" required />
        </div>
        <button type="submit" class="btn-naranja">REGISTRAR</button>
      </form>

      <p @click="vistaActual = 'login'" class="switch-link">
        ¿Ya tienes cuenta? Inicia sesión
      </p>
      
      <button @click="router.push('/')" class="btn-gris" style="margin-top: 15px;">
        Explorar sin Cuenta
      </button>
    </div>

  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.logo-title {
  text-align: center;
  font-size: 2.5rem;
  color: #FA2700;
  margin-bottom: 10px;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.custom-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.custom-input:focus {
  outline: none;
  border-color: #FA2700;
}

.btn-naranja {
  background-color: #FA2700;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-naranja:hover {
  background-color: #d62200;
}

.btn-gris {
  background-color: #555;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
}

.btn-gris:hover {
  background-color: #333;
}

.switch-link {
  text-align: center;
  color: #FA2700;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 15px;
  text-decoration: underline;
}

.switch-link:hover {
  color: #d62200;
}
</style>
