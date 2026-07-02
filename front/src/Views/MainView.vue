<template>
  <div class="main-view-container">
    <HeroBanner />
    
    <div class="main-actions-bar">
      <div>
        <h2>Artículos publicados</h2>
        <p>Revisa los artículos disponibles y haz clic en cualquiera para ver los detalles.</p>
      </div>
      <button class="btn-new-product" @click="router.push('/nuevo-articulo')">
        Publicar artículo
      </button>
    </div>

    <div class="products-grid">
      <ProductCard
        v-for="product in productsDisponibles"
        :key="product.id"
        :title="product.title"
        :location="product.ubicacion"
        :price="product.price"
        :status="product.status"
        :tags="product.tags"
        :image="product.image"
        :es-trueque="product.esTrueque"
        class="clickable-card"
        @click="goToProduct(product.id)"
      />

      <div v-if="productsDisponibles.length === 0" class="empty-state">
        No hay artículos publicados todavía. Crea uno nuevo para verlo aquí.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import HeroBanner from '../components/HeroBanner.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const productosStore = useProductosStore()

const products = computed(() => productosStore.products)
const productsDisponibles = computed(() => products.value.filter(p => p.status === 'Disponible'))

const goToProduct = (productId) => {
  router.push({ name: 'articulo', params: { id: productId } })
}

onMounted(() => {
  productosStore.fetchFromServer()
})
</script>

<style scoped>
.main-view-container {
  padding-top: 20px;
}
.main-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.clickable-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.empty-state {
  grid-column: 1 / -1;
  padding: 36px;
  background: #fff7e4;
  border: 3px dashed var(--brand-brown);
  border-radius: 24px;
  color: #6d4b32;
  font-weight: bold;
  text-align: center;
}

.btn-new-product {
  background: var(--brand-orange);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 18px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  width: auto;
  transition: opacity 0.2s;
}
</style>