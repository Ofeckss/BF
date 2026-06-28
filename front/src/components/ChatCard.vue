<template>
  <div :class="['chat-card', { active: isActive }]" @click="$emit('select')">
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
        <span class="vendedor-nombre">{{ vendedorNombre }}</span>
        <span v-if="unread > 0" class="unread-badge">{{ unread }}</span>
      </div>
      <p class="ultimo-msg">{{ ultimoMensaje }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  articuloNombre: { type: String, default: 'Artículo' },
  vendedorNombre: { type: String, default: '' },
  imagen: { type: String, default: '' },
  ultimoMensaje: { type: String, default: '' },
  hora: { type: String, default: '' },
  unread: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false }
})

defineEmits(['select'])
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
}

.chat-card:hover { background-color: #FFF6B2; }

.chat-card.active {
  background-color: #FFF6B2;
  border-color: #FA2700;
}

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
</style>
