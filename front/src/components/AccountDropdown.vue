<template>
  <div class="account-wrapper" ref="wrapperRef">

    <!-- Botón cuenta (sesión activa) -->
    <button class="btn-nav-badge" @click="toggleDropdown">
      <div class="icon-circle account-lavender">
        <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
      </div>
      <span class="badge-text">{{ auth.user?.name?.split(' ')[0] || 'Cuenta' }}</span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">

        <!-- Header -->
        <div class="dropdown-header">
          <div class="avatar-circle">
            {{ initials }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ auth.user?.name || 'Usuario' }}</span>
            <span class="user-email">{{ auth.user?.email || '' }}</span>
          </div>
        </div>

        <div class="dropdown-divider" />

        <!-- Opciones -->
        <ul class="dropdown-list">
          <li @click="navigate('/perfil')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/></svg>
            Perfil
          </li>
          <li @click="navigate('/ajustes')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/></svg>
            Ajustes
          </li>
          <li @click="navigate('/historial')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-5-5-5v4zm-1 5v5l4 2.5-.75 1.23L11 14V8h1z" fill="currentColor"/></svg>
            Historial
          </li>
          <li @click="navigate('/mensajes')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/></svg>
            Mensajes
          </li>
          <li @click="navigate('/mis-articulos')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.47 0 12.34 0c-1.67 0-3.13.7-4.19 1.8L12 5.77l3.85-3.97C16.55 2.68 17.41 4.22 17 6H7c-2.76 0-5 2.24-5 5v9c0 2.76 2.24 5 5 5h13c2.76 0 5-2.24 5-5V11c0-2.76-2.24-5-5-5zm-8 9H8v-2h4v2zm4-4H8V9h8v2z" fill="currentColor"/></svg>
            Artículos
          </li>
          <li class="highlight" @click="navigate('/nuevo-articulo')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
            Publicar artículo
          </li>
        </ul>

        <div class="dropdown-divider" />

        <!-- Cerrar sesión -->
        <button class="btn-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/></svg>
          Cerrar sesión
        </button>

      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const isOpen = ref(false)
const wrapperRef = ref(null)

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const navigate = (path) => {
  isOpen.value = false
  router.push(path)
}

const handleLogout = () => {
  isOpen.value = false
  auth.logout()
  router.push('/')
}

const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.account-wrapper {
  position: relative;
}

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

.icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: #FFFDF0;
  border: 2px solid #594542;
  border-radius: 14px;
  width: 230px;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(89, 69, 66, 0.18);
}

/* Header del dropdown */
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background-color: #FFF6B2;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FA2700;
  color: white;
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2c1a18;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.7rem;
  color: #594542;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1.5px;
  background-color: #e8ddd0;
}

/* Lista de opciones */
.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 6px 0;
}

.dropdown-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c1a18;
  cursor: pointer;
  transition: background-color 0.15s;
}

.dropdown-list li svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #594542;
}

.dropdown-list li:hover {
  background-color: #FFF6B2;
}

.dropdown-list li.highlight {
  color: #FA2700;
  background-color: #fff3e0;
}

.dropdown-list li.highlight svg {
  color: #FA2700;
}

.dropdown-list li.highlight:hover {
  background-color: #ffe5cc;
}

/* Cerrar sesión */
.btn-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background-color: #FA2700;
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-logout svg {
  width: 18px;
  height: 18px;
  color: white;
}

.btn-logout:hover {
  background-color: #d92100;
}

/* Animación */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
