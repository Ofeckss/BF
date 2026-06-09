<template>
  <nav class="navbar-container">
    
    <!-- Logo Bartify estilo botón izquierdo -->
    <div @click="router.push('/')" class="logo-box">
      BARTIFY
    </div>

    <!-- Barra de búsqueda centralizada -->
    <div class="search-wrapper">
      <input type="text" placeholder="Search bar" class="search-input" />
      <button class="search-btn">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <!-- Bloque de controles derecho -->
    <div class="controls-group">
      
      <!-- Botón Enviar / Ubicación -->
      <button class="btn-nav-badge">
        <div class="icon-circle location-purple">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
          </svg>
        </div>
        <span class="badge-text">Enviar</span>
      </button>

      <!-- Botón de Cuenta (Maneja el estado con Pinia) -->
      <button 
        v-if="!auth.isLoggedIn" 
        @click="router.push('/opciones-login')"
        class="btn-nav-badge"
      >
        <div class="icon-circle account-lavender">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
        </div>
        <span class="badge-text">Cuenta</span>
      </button>

      <!-- Vista cuando la sesión está activa -->
      <div v-else class="sesion-activa-box">
        <span class="user-email-text">{{ auth.userEmail }}</span>
        <button @click="auth.logoutUser" class="btn-salir-nav">Salir</button>
      </div>

    </div>

  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore' 

const router = useRouter()
const auth = useAuthStore() 
</script>

<style scoped>
/* Contenedor principal de la barra con el color Cream original */
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF6B2; /* Tu brand-cream exacto */
  padding: 12px 30px;
  border-bottom: 4px solid #594542; /* Tu brand-brown de borde */
}

/* Caja de texto BARTIFY estilo botón rígido */
.logo-box {
  background-color: #FA2700; /* Tu brand-orange */
  color: white;
  padding: 8px 20px;
  font-weight: 900;
  font-size: 1.3rem;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Contenedor e Inputs de la barra de búsqueda */
.search-wrapper {
  display: flex;
  align-items: center;
  background-color: #FA2700;
  padding: 6px 10px;
  border-radius: 10px;
  width: 45%;
  max-width: 600px;
}

.search-input {
  flex: 1;
  border: none;
  background-color: #FF6B52; /* Tono naranja claro interno para el campo */
  padding: 8px 14px;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.search-input:focus {
  outline: none;
  background-color: #ff7b63;
}

.search-btn {
  background: none;
  border: none;
  color: #594542;
  cursor: pointer;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 22px;
  height: 22px;
}

/* Agrupación de botones derechos */
.controls-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Estructura de botones de control (Enviar / Cuenta) */
.btn-nav-badge {
  background-color: #FA2700;
  border: none;
  border-radius: 10px;
  width: 65px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.1s;
}

.btn-nav-badge:hover {
  transform: scale(1.04);
}

/* Círculos internos para los iconos */
.icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Colores específicos de los círculos según tu mockup */
.location-purple {
  background-color: #5E5CC6;
  color: white;
}

.account-lavender {
  background-color: #E2D9FF;
  color: #5E5CC6;
}

.badge-icon {
  width: 18px;
  height: 18px;
}

.badge-text {
  color: white;
  font-size: 0.72rem;
  font-weight: bold;
}

/* Contenedor de sesión de usuario autenticado */
.sesion-activa-box {
  background-color: #FA2700;
  padding: 6px 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.user-email-text {
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-salir-nav {
  background-color: #594542;
  color: white;
  border: none;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-salir-nav:hover {
  background-color: #423331;
}
</style>