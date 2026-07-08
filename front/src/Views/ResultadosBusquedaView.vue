<template>
  <div class="resultados-container">
    <div class="resultados-header">
      <h2 class="resultados-titulo">
        Resultados para "{{ query }}"
        <span class="resultados-count">({{ resultadosFiltrados.length }})</span>
      </h2>

      <label class="check-no-disponibles">
        <input type="checkbox" v-model="mostrarNoDisponibles" />
        Mostrar no disponibles
      </label>
    </div>

    <p v-if="productosStore.searchLoading" class="estado-msg">Buscando artículos...</p>

    <p v-else-if="productosStore.searchError" class="estado-msg">
      {{ productosStore.searchError }}
    </p>

    <p v-else-if="resultadosFiltrados.length === 0" class="estado-msg">
      No encontramos artículos que coincidan con tu búsqueda.
    </p>

    <div v-else class="resultados-grid">
      <ProductCard
        v-for="producto in resultadosFiltrados"
        :key="producto.id"
        :title="producto.title"
        :location="producto.location"
        :price="producto.price"
        :status="producto.status"
        :tags="producto.tags"
        :image="producto.image"
        :esTrueque="producto.esTrueque"
        @click="router.push(`/articulo/${producto.id}`)"
        class="clickable-card"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productosStore = useProductosStore()

const query = computed(() => route.query.q || '')

const mostrarNoDisponibles = ref(false)

const resultadosFiltrados = computed(() => {
  if (mostrarNoDisponibles.value) return productosStore.searchResults
  return productosStore.searchResults.filter((p) => p.status === 'Disponible')
})

const buscar = () => {
  // El backend espera Nombre (y opcionalmente PrecioMin, PrecioMax,
  // CategoriaId, EsTrueque, UbicacionId, EstadoId) para filtros futuros.
  productosStore.searchArticulos({
    Nombre: query.value || null
  })
}

onMounted(buscar)

// Si el usuario busca de nuevo desde la navbar estando ya en /buscar,
// la ruta cambia el query param y volvemos a pedir resultados.
watch(query, buscar)
</script>

<style scoped>
.resultados-container {
  padding: 24px 30px;
}

.resultados-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.resultados-titulo {
  font-size: 1.4rem;
  margin-bottom: 0;
  color: var(--brand-dark-gray, #333);
}

.check-no-disponibles {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  user-select: none;
}

.check-no-disponibles input {
  cursor: pointer;
}

.resultados-count {
  font-weight: normal;
  font-size: 1rem;
  color: #777;
}

.estado-msg {
  font-size: 1rem;
  color: #777;
  margin-top: 20px;
}

.resultados-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.clickable-card {
  cursor: pointer;
}
</style>