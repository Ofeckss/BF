<template>
  <div class="resultados-container">
    <h2 class="resultados-titulo">
      Resultados para "{{ query }}"
      <span class="resultados-count">({{ productosStore.searchResults.length }})</span>
    </h2>

    <p v-if="productosStore.searchLoading" class="estado-msg">Buscando artículos...</p>

    <p v-else-if="productosStore.searchError" class="estado-msg">
      {{ productosStore.searchError }}
    </p>

    <p v-else-if="productosStore.searchResults.length === 0" class="estado-msg">
      No encontramos artículos que coincidan con tu búsqueda.
    </p>

    <div v-else class="resultados-grid">
      <ProductCard
        v-for="producto in productosStore.searchResults"
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
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productosStore = useProductosStore()

const query = computed(() => route.query.q || '')

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

.resultados-titulo {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--brand-dark-gray, #333);
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