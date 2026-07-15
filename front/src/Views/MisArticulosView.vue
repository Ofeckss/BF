<template>
  <div class="mis-articulos-page">

    <div class="page-header">
      <h1>Mis artículos</h1>
      <button class="btn-primary" @click="router.push('/nuevo-articulo')">
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
        Añadir artículo
      </button>
    </div>

    <!-- Filtros rápidos -->
    <div class="filtros">
      <button
        v-for="f in filtros"
        :key="f.key"
        :class="['btn-filtro', { active: filtroActivo === f.key }]"
        @click="filtroActivo = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Estados -->
    <div v-if="loading" class="estado-msg">Cargando tus artículos...</div>
    <div v-else-if="articulosFiltrados.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" width="48" height="48"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.47 0 12.34 0c-1.67 0-3.13.7-4.19 1.8L12 5.77l3.85-3.97C16.55 2.68 17.41 4.22 17 6H7c-2.76 0-5 2.24-5 5v9c0 2.76 2.24 5 5 5h13c2.76 0 5-2.24 5-5V11c0-2.76-2.24-5-5-5zm-8 9H8v-2h4v2zm4-4H8V9h8v2z" fill="currentColor"/></svg>
      <p>No tienes artículos en esta categoría.</p>
      <button class="btn-primary" @click="router.push('/nuevo-articulo')">Publicar mi primer artículo</button>
    </div>

    <!-- Grid de artículos -->
    <div v-else class="cards-grid">
      <div
        v-for="art in articulosFiltrados"
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
          :es-trueque="art.esTrueque"
        />
        <button class="btn-editar" @click.stop="router.push(`/editar-articulo/${art.id}`)">
          ✏️ Editar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ProductCard from '../components/ProductCard.vue'
import productosApi from '../services/productosApi'

const router = useRouter()
const auth = useAuthStore()

const articulos = ref([])
const loading = ref(false)
const filtroActivo = ref('todos')

const filtros = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponible', label: 'Disponibles' },
  { key: 'trueque', label: 'Trueque' },
  { key: 'venta', label: 'Venta' },
]

const articulosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') return articulos.value
  if (filtroActivo.value === 'disponible') return articulos.value.filter(a => a.status === 'Disponible')
  if (filtroActivo.value === 'trueque') return articulos.value.filter(a => a.esTrueque)
  if (filtroActivo.value === 'venta') return articulos.value.filter(a => !a.esTrueque)
  return articulos.value
})

onMounted(async () => {
  if (!auth.user?.id) return
  loading.value = true
  try {
    const res = await productosApi.getByUsuarioId(auth.user.id)
    const raw = res?.data || []
    const mapped = raw.map(a => ({
      id: String(a.id),
      title: a.nombre,
      price: Number(a.precio),
      location: a.ubicacion?.nombre || 'Playa del Carmen',
      status: a.disponible ? 'Disponible' : 'No disponible',
      esTrueque: a.esTrueque,
      tags: a.categoria ? [a.categoria.nombre] : [],
      image: ''
    }))
    articulos.value = await Promise.all(mapped.map(async p => {
      try {
        const fRes = await productosApi.getFotosByArticulo(p.id)
        p.image = fRes?.data?.[0]?.url || ''
      } catch { p.image = '' }
      return p
    }))
  } catch (e) {
    console.error('Error cargando artículos', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.mis-articulos-page {
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

h1 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-primary:hover { background-color: #d92100; }

.filtros {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-filtro {
  background: white;
  border: 2px solid #e8ddd0;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #594542;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-filtro:hover { border-color: #FA2700; color: #FA2700; }
.btn-filtro.active { background-color: #FA2700; border-color: #FA2700; color: white; }

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card-wrap {
  cursor: pointer;
  transition: transform 0.15s;
  position: relative; 
}

.card-wrap:hover { transform: translateY(-3px); }

 .btn-editar {
   margin-top: 8px;
   width: 100%;
   background: white;
   color: #FA2700;
   border: 2px solid #FA2700;
   border-radius: 8px;
   padding: 6px 12px;
   font-size: 0.82rem;
   font-weight: 700;
   cursor: pointer;
   transition: background-color 0.15s;
 }
 .btn-editar:hover { background-color: #fff3f0; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #aaa;
}

.empty-state svg { color: #ddd; }
.empty-state p { font-size: 1rem; margin: 0; color: #999; }

.estado-msg {
  font-size: 0.95rem;
  color: #888;
  padding: 20px 0;
}
</style>