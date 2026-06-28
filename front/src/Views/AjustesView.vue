<template>
  <div class="ajustes-page">
    <h1>Ajustes y configuración</h1>

    <!-- Información personal -->
    <section class="settings-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
        Información personal
      </h2>
      <div class="fields-group">
        <div class="field">
          <label>Nombre completo</label>
          <input v-model="form.name" type="text" placeholder="Tu nombre completo" />
        </div>
        <div class="field">
          <label>Correo electrónico</label>
          <input v-model="form.email" type="email" placeholder="tu@correo.com" disabled class="disabled-input" />
          <span class="field-hint">El correo no se puede cambiar</span>
        </div>
        <div class="field">
          <label>Teléfono</label>
          <input v-model="form.telefono" type="tel" placeholder="+52 984 000 0000" />
        </div>
      </div>
    </section>

    <!-- Ubicación -->
    <section class="settings-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
        </svg>
        Ubicación
      </h2>
      <div class="fields-group">
        <div class="field">
          <label>Ciudad</label>
          <input v-model="form.ubicacion" type="text" placeholder="Playa del Carmen, Quintana Roo" />
        </div>
      </div>
    </section>

    <!-- Seguridad -->
    <section class="settings-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
        </svg>
        Seguridad
      </h2>
      <div class="fields-group">
        <div v-if="!cambiandoPassword" class="field field-row">
          <div class="field-info">
            <label>Contraseña</label>
            <span class="field-hint">Última actualización: hace algún tiempo</span>
          </div>
          <button class="btn-secondary" @click="cambiandoPassword = true">Cambiar contraseña</button>
        </div>
        <div v-else class="password-form">
          <div class="field">
            <label>Contraseña actual</label>
            <input v-model="passwords.actual" type="password" placeholder="••••••••" />
          </div>
          <div class="field">
            <label>Nueva contraseña</label>
            <input v-model="passwords.nueva" type="password" placeholder="••••••••" />
          </div>
          <div class="field">
            <label>Confirmar nueva contraseña</label>
            <input v-model="passwords.confirmar" type="password" placeholder="••••••••" />
          </div>
          <div class="password-actions">
            <button class="btn-primary" @click="cambiarPassword">Guardar nueva contraseña</button>
            <button class="btn-ghost" @click="cambiandoPassword = false">Cancelar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Acciones -->
    <div class="bottom-actions">
      <button class="btn-primary" :disabled="guardando" @click="guardarCambios">
        {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
      </button>
      <button class="btn-danger-outline" @click="confirmarEliminar">
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
        Eliminar cuenta
      </button>
    </div>

    <!-- Toast feedback -->
    <Transition name="toast">
      <div v-if="toast.visible" :class="['toast', toast.type]">{{ toast.msg }}</div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  telefono: '',
  ubicacion: ''
})

const passwords = ref({ actual: '', nueva: '', confirmar: '' })
const cambiandoPassword = ref(false)
const guardando = ref(false)
const toast = ref({ visible: false, msg: '', type: 'success' })

onMounted(() => {
  form.value = {
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    telefono: auth.user?.telefono || '',
    ubicacion: auth.user?.ubicacion || ''
  }
})

const mostrarToast = (msg, type = 'success') => {
  toast.value = { visible: true, msg, type }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const guardarCambios = async () => {
  guardando.value = true
  try {
    // Actualizar localmente en el store (conectar al endpoint cuando esté disponible)
    const updated = { ...auth.user, ...form.value }
    auth.user = updated
    localStorage.setItem('user', JSON.stringify(updated))
    mostrarToast('Cambios guardados correctamente')
  } catch {
    mostrarToast('Error al guardar los cambios', 'error')
  } finally {
    guardando.value = false
  }
}

const cambiarPassword = async () => {
  if (passwords.value.nueva !== passwords.value.confirmar) {
    mostrarToast('Las contraseñas no coinciden', 'error')
    return
  }
  if (passwords.value.nueva.length < 6) {
    mostrarToast('La contraseña debe tener al menos 6 caracteres', 'error')
    return
  }
  // TODO: conectar al endpoint de cambio de contraseña
  mostrarToast('Contraseña actualizada correctamente')
  cambiandoPassword.value = false
  passwords.value = { actual: '', nueva: '', confirmar: '' }
}

const confirmarEliminar = () => {
  if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
    auth.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.ajustes-page {
  padding: 32px;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: relative;
}

h1 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
}

.settings-section {
  background: white;
  border-radius: 14px;
  border: 2px solid #e8ddd0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.settings-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #f0e8e0;
}

.settings-section h2 svg { color: #FA2700; }

.fields-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #594542;
}

.field input {
  padding: 10px 14px;
  border: 1.5px solid #e8ddd0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: white;
  transition: border-color 0.15s;
  outline: none;
}

.field input:focus { border-color: #FA2700; }

.disabled-input {
  background-color: #f5f5f5 !important;
  color: #999 !important;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.75rem;
  color: #aaa;
}

.field-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.field-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.password-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Botones */
.btn-primary {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-primary:hover:not(:disabled) { background-color: #d92100; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background: white;
  color: #FA2700;
  border: 2px solid #FA2700;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
  white-space: nowrap;
}

.btn-secondary:hover { background-color: #fff3f0; }

.btn-ghost {
  background: none;
  border: none;
  color: #888;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
}

.btn-ghost:hover { color: #444; }

.btn-danger-outline {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: #c0392b;
  border: 2px solid #c0392b;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-danger-outline:hover { background-color: #fff5f5; }

.bottom-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2c2c2c;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.toast.error { background-color: #c0392b; }
.toast.success { background-color: #27ae60; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
