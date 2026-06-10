<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

defineEmits(['cambiarVista'])

const router = useRouter()
const auth = useAuthStore()

const registerForm = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = () => {
  console.log('Datos Registro:', { name: registerForm.name, email: registerForm.email })
  if (registerForm.email) {
    auth.loginUser(registerForm.email)
    router.push('/')
  }
}
</script>

<template>
  <div class="view-fade">
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
      
      <button type="submit" class="btn-orange">REGISTRAR</button>
    </form>
    
    <p @click="$emit('cambiarVista', 'login')" class="switch-view-link">
      ¿Ya tienes cuenta? Inicia sesión
    </p>
    
    <div class="divider-container">
      <div class="line"></div>
      <span class="divider-text">O</span>
      <div class="line"></div>
    </div>
    
    <button @click="router.push('/')" class="btn-light block-btn">
      Explorar sin Cuenta
    </button>
  </div>
</template>

<style scoped>
.logo-title-left {
  font-size: 2.4rem;
  color: var(--brand-orange);
  margin: 0 0 8px 0;
  font-weight: bold;
  text-align: left;
}

.subtitle-left {
  color: #555555;
  margin: 0 0 25px 0;
  font-size: 1rem;
  text-align: left;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 12px 16px;
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
  padding: 14px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-orange:hover {
  background-color: var(--brand-red);
}

.btn-light {
  background-color: #DCDCDC;
  color: #222222;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  width: 100%;
}

.btn-light:hover {
  background-color: #CECECE;
}

.block-btn {
  width: 100%;
}

.switch-view-link {
  text-align: center;
  color: var(--brand-orange);
  font-size: 0.95rem;
  cursor: pointer;
  margin: 20px 0 0 0;
  text-decoration: underline;
}

.switch-view-link:hover {
  color: var(--brand-red);
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
  background-color: var(--brand-orange); 
  opacity: 0.4; 
}

.divider-text { 
  padding: 0 15px; 
  font-weight: bold; 
  color: #222222;
}

.view-fade { 
  animation: fadeIn 0.3s ease-in-out; 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>