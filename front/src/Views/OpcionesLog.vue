<script setup>
import { ref } from 'vue'
import AuthOpciones from '../components/auth/AuthOpciones.vue'
import AuthLogin from '../components/auth/AuthLogin.vue'
import AuthRegistro from '../components/auth/AuthRegistro.vue'

const vistaActual = ref('opciones')

const cambiarPantalla = (nuevaVista) => {
  vistaActual.value = nuevaVista
}
</script>

<template>
  <div class="auth-page-container">
    
    <div class="auth-card">
      
      <AuthOpciones 
        v-if="vistaActual === 'opciones'" 
        @cambiarVista="cambiarPantalla" 
      />

      <AuthLogin 
        v-else-if="vistaActual === 'login'" 
        @cambiarVista="cambiarPantalla" 
      />

      <AuthRegistro 
        v-else-if="vistaActual === 'registro'" 
        @cambiarVista="cambiarPantalla" 
      />

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
</style>