<template>
  <div class="historial-page">

    <div class="page-header">
      <div class="title-row">
        <svg class="title-icon" viewBox="0 0 24 24" fill="none">
          <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-5-5-5v4zm-1 5v5l4 2.5-.75 1.23L11 14V8h1z" fill="currentColor"/>
        </svg>
        <h1>Historial de artículos vistos</h1>
      </div>
      <button v-if="historialStore.historial.length > 0" class="btn-limpiar" @click="confirmarLimpiar">
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
        Limpiar historial
      </button>
    </div>

    <!-- Banner resumen -->
    <div v-if="historialStore.historial.length > 0" class="summary-banner">
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
      </svg>
      <span>Has visto <strong>{{ historialStore.historial.length }} artículos</strong> en los últimos 30 días</span>
    </div>

    <!-- Vacío -->
    <div v-if="historialStore.historial.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
        <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-5-5-5v4zm-1 5v5l4 2.5-.75 1.23L11 14V8h1z" fill="currentColor"/>
      </svg>
      <p>Tu historial está vacío.</p>
      <button class="btn-primary" @click="router.push('/')">Explorar artículos</button>
    </div>

    <!-- Agrupado por fecha -->
    <div v-else class="grupos">
      <div v-for="grupo in gruposPorFecha" :key="grupo.fecha" class="grupo">
        <h3 class="grupo-fecha">{{ grupo.label }}</h3>
        <div class="cards-grid">
          <div
            v-for="art in grupo.items"
            :key="art.id"
            class="card-wrap"
            @click="router.push(`/articulo/${art.id}`)"
          >
            <ProductCard
              :title="art.title"
              :price="art.price"
              :location="art.location"
              :status="art.status"
              :tags="art.tags"
              :image="art.image"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useHistorialStore } from '../stores/historialStore'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const auth = useAuthStore()
const historialStore = useHistorialStore()

onMounted(() => {
  historialStore.cargarHistorial(auth.user?.id)
})

const gruposPorFecha = computed(() => {
  const hoy = new Date()
  const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1)
  const grupos = {}

  for (const art of historialStore.historial) {
    const d = new Date(art.visitadoEn)
    let key, label
    if (d.toDateString() === hoy.toDateString()) {
      key = 'hoy'; label = 'Hoy'
    } else if (d.toDateString() === ayer.toDateString()) {
      key = 'ayer'; label = 'Ayer'
    } else {
      key = d.toISOString().slice(0, 10)
      label = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
    }
    if (!grupos[key]) grupos[key] = { fecha: key, label, items: [] }
    grupos[key].items.push(art)
  }

  return Object.values(grupos)
})

const confirmarLimpiar = () => {
  if (confirm('¿Seguro que quieres limpiar tu historial?')) {
    historialStore.limpiarHistorial(auth.user?.id)
  }
}
</script>

<style scoped>
.historial-page {
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 36px;
  height: 36px;
  color: #FA2700;
}

h1 {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.btn-limpiar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: #FA2700;
  border: 2px solid #FA2700;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-limpiar:hover { background-color: #fff3f0; }

.summary-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #FFF6B2;
  border-left: 4px solid #FA2700;
  border-radius: 8px;
  padding: 14px 18px;
  font-size: 0.9rem;
  color: #2c1a18;
}

.summary-banner svg { color: #FA2700; flex-shrink: 0; }
.summary-banner strong { color: #FA2700; }

.grupo-fecha {
  font-size: 1rem;
  font-weight: 700;
  color: #594542;
  margin: 0 0 14px;
  padding-bottom: 6px;
  border-bottom: 1.5px solid #e8ddd0;
  text-transform: capitalize;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-wrap {
  cursor: pointer;
  transition: transform 0.15s;
}

.card-wrap:hover { transform: translateY(-3px); }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #aaa;
}

.empty-state p { font-size: 1rem; margin: 0; }

.btn-primary {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:hover { background-color: #d92100; }
</style>
