<template>
  <div class="perfil-page">

    <!-- Columna izquierda: datos del usuario -->
    <aside class="sidebar">
      <div class="avatar-circle">{{ initials }}</div>
      <h2 class="user-name">{{ auth.user?.name || 'Usuario' }}</h2>
      <p class="user-since">Miembro desde {{ memberSince }}</p>

      <ul class="user-details">
        <li>
          <svg viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
          {{ auth.user?.email || '—' }}
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" fill="currentColor"/></svg>
          {{ auth.user?.telefono || 'No registrado' }}
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/></svg>
          {{ auth.user?.ubicacion || 'Playa del Carmen' }}
        </li>
      </ul>
      <button class="btn-settings" @click="router.push('/ajustes')">Editar perfil</button>
      <div class="stats-box">
        <h4>Estadísticas</h4>
        <div class="stat-row">
          <span>Artículos publicados</span>
          <strong>{{ misArticulos.length }}</strong>
        </div>
        <div class="stat-row">
          <span>Trueques realizados</span>
          <strong>{{ trueques }}</strong>
        </div>
        <div class="stat-row">
          <span>Ventas completadas</span>
          <strong>{{ ventas }}</strong>
        </div>
      </div>
    </aside>

    <!-- Columna derecha: secciones -->
    <main class="main-content">

      <!-- Artículos publicados (preview 3) -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Artículos publicados</h3>
          <div class="header-actions">
            <button class="btn-secondary" @click="router.push('/mis-articulos')">Ver todos</button>
            <button class="btn-primary" @click="router.push('/nuevo-articulo')">+ Publicar nuevo</button>
          </div>
        </div>

        <div v-if="loadingArticulos" class="estado-msg">Cargando artículos...</div>
        <div v-else-if="misArticulos.length === 0" class="estado-msg muted">Aún no has publicado ningún artículo.</div>
        <div v-else class="cards-row">
          <div
            v-for="art in misArticulos.slice(0, 3)"
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
      </section>

      <!-- Historial reciente (preview 3) -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Historial reciente</h3>
          <button class="btn-secondary" @click="router.push('/historial')">Ver historial completo</button>
        </div>

        <div v-if="historial.length === 0" class="estado-msg muted">No hay artículos en tu historial.</div>
        <div v-else class="cards-row">
          <div
            v-for="art in historial.slice(0, 3)"
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
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProductosStore } from '../stores/productosStore'
import { useHistorialStore } from '../stores/historialStore'
import ProductCard from '../components/ProductCard.vue'
import productosApi from '../services/productosApi'

const router = useRouter()
const auth = useAuthStore()
const productosStore = useProductosStore()
const historialStore = useHistorialStore()

const misArticulos = ref([])
const loadingArticulos = ref(false)
const trueques = ref(0)
const ventas = ref(0)

const historial = computed(() => historialStore.historial)

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
})

const memberSince = computed(() => {
  if (!auth.user?.createdAt) return 'hace un tiempo'
  const d = new Date(auth.user.createdAt)
  return d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
})

onMounted(async () => {
  if (!auth.user?.id) return
  loadingArticulos.value = true
  try {
    const res = await productosApi.getByUsuarioId(auth.user.id)
    const raw = res?.data || []
    const mapped = raw.map(a => ({
      id: String(a.id),
      title: a.nombre,
      price: Number(a.precio),
      location: a.ubicacion?.nombre || 'Playa del Carmen',
      status: a.disponible ? 'Disponible' : 'No disponible',
      tags: a.categoria ? [a.categoria.nombre] : [],
      image: ''
    }))
    // Cargar fotos
    misArticulos.value = await Promise.all(mapped.map(async p => {
      try {
        const fRes = await productosApi.getFotosByArticulo(p.id)
        p.image = fRes?.data?.[0]?.url || ''
      } catch { p.image = '' }
      return p
    }))
    trueques.value = misArticulos.value.filter(a => a.esTrueque).length
    ventas.value = misArticulos.value.filter(a => !a.esTrueque && a.status === 'No disponible').length
  } catch (e) {
    console.error('Error cargando artículos del usuario', e)
  } finally {
    loadingArticulos.value = false
  }
})
</script>

<style scoped>
.perfil-page {
  display: flex;
  gap: 32px;
  padding: 32px;
  min-height: calc(100vh - 80px);
  background-color: #f9f9f9;
  align-items: flex-start;
}

/* Sidebar */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  border: 2px solid #e8ddd0;
  padding: 24px 20px;
  gap: 8px;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #E2D9FF;
  color: #5E5CC6;
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.user-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
}

.user-since {
  font-size: 0.78rem;
  color: #888;
  margin: 0 0 8px;
}

.user-details {
  list-style: none;
  padding: 0;
  margin: 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-details li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #444;
  word-break: break-all;
}

.user-details li svg {
  width: 16px;
  height: 16px;
  color: #FA2700;
  flex-shrink: 0;
}

.stats-box {
  width: 100%;
  background-color: #FFF6B2;
  border-left: 4px solid #FA2700;
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 12px;
}

.stats-box h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2c1a18;
  margin: 0 0 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #444;
  padding: 3px 0;
}

.stat-row strong {
  color: #FA2700;
  font-weight: 800;
}

/* Main */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.preview-section {
  background: white;
  border-radius: 16px;
  border: 2px solid #e8ddd0;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.section-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-primary:hover { background-color: #d92100; }

.btn-secondary {
  background-color: white;
  color: #FA2700;
  border: 2px solid #FA2700;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-secondary:hover { background-color: #fff3f0; }

.btn-settings {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-settings:hover { background-color: #d92100; }

.cards-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card-wrap {
  cursor: pointer;
  transition: transform 0.15s;
}

.card-wrap:hover { transform: translateY(-3px); }

.estado-msg {
  font-size: 0.9rem;
  color: #444;
  padding: 12px 0;
}

.estado-msg.muted { color: #aaa; }
</style>