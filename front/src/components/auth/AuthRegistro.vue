<script setup>
import { reactive, ref } from 'vue' 
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const auth = useAuthStore()


const isLoading = ref(false)

const registerForm = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  isLoading.value = true 
  try {

    await auth.registerUser(registerForm.name, registerForm.email, registerForm.password, 1)
    
    alert("Cuenta creada exitosamente")
    router.push('/login')
  } catch (error) {
    console.error("Error al registrar:", error)
    alert("Hubo un error al registrar. Verifica tu conexión o intenta con otro correo.")
  } finally {
    isLoading.value = false 
  }
}
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card view-fade">
      <h1 class="logo-title-left">Únete a Bartify</h1>
      <p class="subtitle-left">Crea tu cuenta y empieza a vender o cambiar</p>
      
      <form @submit.prevent="handleRegister" class="form-layout">
        <div class="input-container">
          <label class="form-label" for="name">Nombre</label>
          <input type="text" id="name" v-model="registerForm.name" class="form-input" required />
        </div>

        <div class="input-container">
          <label class="form-label" for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="registerForm.email" class="form-input" required />
        </div>

        <div class="input-container">
          <label class="form-label" for="password">Contraseña</label>
          <input type="password" id="password" v-model="registerForm.password" class="form-input" required />
        </div>
        
        <button 
          type="submit" 
          class="btn-orange" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Procesando...' : 'Registrarse' }}
        </button>
      </form>

      <div class="switch-view-link" @click="router.push('/login')">
        ¿Ya tienes cuenta? Inicia Sesión aquí
      </div>

      <button type="button" @click="router.push('/')" class="btn-explorar-secundario">
        Explorar sin cuenta
      </button>
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

.logo-title-left {
  text-align: left;
  font-size: 2.2rem;
  color: var(--brand-orange);
  margin: 0 0 12px 0;
  font-weight: bold;
}

.subtitle-left {
  text-align: left;
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
  background-color: #FA2700;
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
  background-color: var(--brand-red);
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

.btn-explorar-secundario {
  background-color: #E0E0E0;
  color: #333333;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 20px; 
  text-align: center;
  transition: background-color 0.2s;
}

.btn-explorar-secundario:hover {
  background-color: #D0D0D0;
}
</style>