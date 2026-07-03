<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import conectarApi from '../services/api'
import productosApi from '../services/productosApi'
import { useAuthStore } from '../stores/authStore'
import { useHistorialStore } from '../stores/historialStore'
import { useChatStore } from '../stores/chatStore'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const historialStore = useHistorialStore()
const chatStore = useChatStore()

const articulo = ref(null)
const imageUrl = ref('')
const loading = ref(true)
const error = ref('')

const fallback = {
  Nombre: 'Articulo no encontrado',
  Descripcion: 'No se encontró el articulo solicitado.',
  Precio: 0,
  Disponible: false,
  EsTrueque: false,
  Ubicacion: { Nombre: '-' },
  Categoria: { Nombre: '-' },
  Vendedor: { Nombre: 'Desconocido', Apellido: '' }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [articuloRes, fotoRes] = await Promise.all([
      conectarApi.get(`/api/articulos/${id}`),
      productosApi.getFotosByArticulo(id)
    ])

    articulo.value = articuloRes.data
    imageUrl.value = fotoRes.data?.[0]?.url || ''

    if (auth.isLoggedIn && articulo.value) {
      historialStore.registrarVisita({
        id: String(id),
        title: articulo.value.Nombre,
        price: articulo.value.Precio,
        location: articulo.value.Ubicacion?.Nombre || '',
        status: articulo.value.Disponible ? 'Disponible' : 'No disponible',
        esTrueque: articulo.value.EsTrueque,
        tags: articulo.value.Categoria?.Nombre ? [articulo.value.Categoria.Nombre] : [],
        image: fotoRes.data?.[0]?.url || ''
      }, auth.user.id)
    }
  } catch (err) {
    console.warn('No se puede cargar el articulo: ', err)
    articulo.value = fallback
    error.value = 'No se pudo cargar el articulo.'
  } finally {
    loading.value = false
  }
})

const ownerName = () => {
  const v = articulo.value?.vendedor
  if (!v) return 'Desconocido'
  return `${v.nombre} ${v.apellido || ''}`.trim()
}

const regresar = () => router.push('/')

const proponerTrueque = async () => {
  if (!articulo.value || articulo.value === fallback) return

  console.log('articulo completo:', articulo.value)
  console.log('vendedor:', articulo.value.vendedor)
  console.log('vendedorId:', articulo.value.vendedor?.vendedorId)

  await chatStore.openChannelForArticulo({
    articuloId: route.params.id,
    vendedorId: articulo.value.vendedor?.vendedorId,
    articuloNombre: articulo.value.nombre,
    imagenUrl: imageUrl.value,
    sellerNickname: ownerName()
  })

  router.push('/chat')
}

const iniciarCompra = async () => {
  if (!auth.isLoggedIn) return router.push('/login')
  if (!articulo.value || articulo.value === fallback) return

  console.log('articulo completo (compra):', articulo.value)
  console.log('vendedor:', articulo.value.vendedor)
  console.log('vendedorId:', articulo.value.vendedor?.vendedorId)

  await chatStore.openChannelForArticulo({
    articuloId: route.params.id,
    vendedorId: articulo.value.vendedor?.vendedorId,
    articuloNombre: articulo.value.nombre,
    imagenUrl: imageUrl.value,
    sellerNickname: ownerName()
  })

  router.push('/chat')
}
</script>

<template>
  <div class="product-detail-container">

    <button @click="regresar" class="btn-back">
      ← Volver al inicio
    </button>

    <div v-if="loading" class="loading-state">
      Cargando artículo...
    </div>

    <div v-else-if="articulo" class="product-columns-wrapper">
      <div class="media-column">
        <div class="main-image-box">
          <img 
            :src="imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'" 
            :alt="articulo.Nombre" 
            class="display-img" 
          />
        </div>
      </div>

      <div class="info-column">

        <div class="header-info">
          <h1 class="item-title">{{ articulo.nombre }}</h1>
          <span class="status-badge">{{ articulo.disponible ? 'Disponible' : 'No disponible' }}</span>
        </div>

        <div class="location-box">
          <span class="pin-icon">📍</span>
          <span class="location-text">{{ articulo.ubicacion?.nombre || '-' }}</span>
        </div>

        <div class="price-box">
          <span class="price-label">Precio estimado:</span>
          <h2 class="price-value">${{ articulo.precio?.toLocaleString('es-MX') ?? 0 }} MXN</h2>
        </div>

        <div class="tags-row">
          <span v-if="articulo.categoria?.nombre" class="tag-pill">
            {{ articulo.categoria.nombre }}
          </span>
          <span v-if="articulo.esTrueque" class="tag-pill trueque">
            Acepta trueque
          </span>
        </div>

        <div class="description-card">
          <h3>Descripción del artículo</h3>
          <p>{{ articulo.descripcion }}</p>
        </div>

        <div class="owner-card">
          <div class="owner-avatar">
            {{ ownerName().charAt(0).toUpperCase() }}
          </div>
          <div class="owner-details">
            <h4>{{ ownerName() }}</h4>
          </div>
        </div>

        <div v-if="articulo.disponible" class="action-buttons-stack">
          <button v-if="articulo.esTrueque" @click="proponerTrueque" class="btn-trueque btn-full">
            🔄 Proponer trueque
          </button>
          <button v-else @click="iniciarCompra" class="btn-compra btn-full">
            💳 Iniciar compra
          </button>
        </div>

        <div v-else class="action-buttons-stack">
          <button disabled class="btn-primary-action-disabled">
            No disponible
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-container {
  margin-top: 30px;
  margin-bottom: 50px;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}

.btn-back {
  background: none;
  border: none;
  color: var(--brand-brown);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.btn-back:hover { color: var(--brand-orange); }

.loading-state {
  text-align: center;
  padding: 60px;
  color: var(--brand-dark-gray);
  font-size: 1.1rem;
}

.product-columns-wrapper {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: start;
}

.media-column { width: 100%; }

.main-image-box {
  width: 100%;
  height: 500px;
  background-color: var(--brand-cream);
  border: 4px solid var(--brand-brown);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

.display-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.item-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #000000;
  margin: 0;
}

.status-badge {
  background-color: var(--brand-dark-gray);
  color: #FFFFFF;
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  white-space: nowrap;
}

.location-box {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-dark-gray);
  font-size: 1.05rem;
}

.price-box {
  background-color: var(--brand-cream);
  border-left: 5px solid var(--brand-orange);
  padding: 15px 20px;
  border-radius: 12px;
}

.price-label {
  font-size: 0.9rem;
  color: var(--brand-brown);
  font-weight: 600;
}

.price-value {
  font-size: 2.2rem;
  color: var(--brand-orange);
  margin: 4px 0 0 0;
  font-weight: 800;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-pill {
  background-color: var(--brand-sand);
  color: var(--brand-brown);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.tag-pill.trueque {
  background-color: var(--brand-cream);
  color: var(--brand-orange);
  border: 1.5px solid var(--brand-orange);
}

.description-card {
  background-color: #FFFFFF;
  border: 2px solid #EFEFEF;
  border-radius: 16px;
  padding: 20px;
}

.description-card h3 {
  margin: 0 0 10px 0;
  color: var(--brand-brown);
  font-size: 1.2rem;
}

.description-card p {
  margin: 0;
  line-height: 1.6;
  color: #444444;
}

.owner-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #FAFAFA;
  padding: 15px;
  border-radius: 16px;
  border: 1px solid #EAEAEA;
}

.owner-avatar {
  width: 45px;
  height: 45px;
  background-color: var(--brand-dark-gray);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.owner-details h4 {
  margin: 0 0 2px 0;
  color: #000000;
}

.action-buttons-stack {
  margin-top: 10px;
  display: flex;
  gap: 12px;
}

.btn-trueque {
  flex: 1;
  background-color: var(--brand-orange);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(250, 39, 0, 0.3);
  transition: background-color 0.2s;
}

.btn-trueque:hover { background-color: var(--brand-red); }

.btn-compra {
  flex: 1;
  background-color: white;
  color: var(--brand-orange);
  border: 2.5px solid var(--brand-orange);
  border-radius: 16px;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-compra:hover {
  background-color: var(--brand-orange);
  color: white;
}

.btn-primary-action-disabled {
  background-color: var(--brand-dark-gray);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 18px;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 4px 14px rgba(70, 11, 1, 0.3);
}

.btn-full {
  flex: 1 1 100%;
  width: 100%;
}

@media (max-width: 900px) {
  .product-detail-container { padding: 0 20px; }
  .product-columns-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .main-image-box { height: 350px; }
  .action-buttons-stack { flex-direction: column; }
}
</style>