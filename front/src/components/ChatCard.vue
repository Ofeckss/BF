<template>
  <div :class="['chat-card', { active: isActive, archived: isArchived, 'menu-open': menuAbierto }]" @click="$emit('select')">
    <div class="card-img-wrap">
      <img v-if="imagen" :src="imagen" :alt="articuloNombre" class="card-img" />
      <div v-else class="card-img-placeholder">
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    <div class="card-body">
      <div class="card-top">
        <span class="articulo-nombre">{{ articuloNombre }}</span>
        <span class="card-hora">{{ hora }}</span>
      </div>
      <div class="card-bottom">
        <span class="vendedor-nombre">
          <svg class="vendedor-icon" viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/>
          </svg>
          {{ vendedorNombre }}
        </span>
        <span v-if="unread > 0" class="unread-badge">{{ unread }}</span>
      </div>
      <p class="ultimo-msg">{{ ultimoMensaje }}</p>
    </div>

    <div class="card-menu-wrap" @click.stop>
      <button class="btn-menu" title="Opciones" @click="menuAbierto = !menuAbierto">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      <div v-if="menuAbierto" class="menu-overlay" @click="menuAbierto = false"></div>
      <div v-if="menuAbierto" class="card-menu">
        <button class="menu-item" @click="onToggleArchivar">
          <span v-if="isArchived">📤 Desarchivar chat</span>
          <span v-else>📥 Archivar chat</span>
        </button>
        <button class="menu-item menu-item-danger" @click="onEliminar">
          🗑️ Eliminar chat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  articuloNombre: { type: String, default: 'Artículo' },
  vendedorNombre: { type: String, default: '' },
  imagen: { type: String, default: '' },
  ultimoMensaje: { type: String, default: '' },
  hora: { type: String, default: '' },
  unread: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'archive', 'unarchive', 'delete'])

const menuAbierto = ref(false)

function onToggleArchivar() {
  menuAbierto.value = false
  emit(props.isArchived ? 'unarchive' : 'archive')
}

function onEliminar() {
  menuAbierto.value = false
  emit('delete')
}
</script>

<style scoped>
.chat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  border: 2px solid transparent;
  position: relative;
}

.chat-card:hover { background-color: #FFF6B2; }

.chat-card.active {
  background-color: #FFF6B2;
  border-color: #FA2700;
}

.chat-card.archived { opacity: 0.65; }

.chat-card.menu-open { z-index: 20; }

.card-img-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #e8ddd0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-placeholder { color: #bbb; }

.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  padding-right: 22px;
}

.articulo-nombre {
  font-size: 0.88rem;
  font-weight: 800;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-hora {
  font-size: 0.72rem;
  color: #aaa;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vendedor-nombre {
  font-size: 0.78rem;
  color: #594542;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vendedor-icon {
  flex-shrink: 0;
  color: #b3a89f;
}

.unread-badge {
  background-color: #FA2700;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ultimo-msg {
  font-size: 0.78rem;
  color: #888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Menú de opciones (archivar / eliminar) --- */
.card-menu-wrap {
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn-menu {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 3px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, color 0.15s;
}
.btn-menu:hover { background-color: rgba(0, 0, 0, 0.06); color: #594542; }

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 900;
}

.card-menu {
  position: absolute;
  top: 24px;
  right: 0;
  z-index: 901;
  background: white;
  border: 1.5px solid #e8ddd0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  min-width: 168px;
}

.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 10px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
}
.menu-item:hover { background-color: #fff6f4; }

.menu-item-danger { color: #d92100; }
.menu-item-danger:hover { background-color: #fdecea; }
</style>