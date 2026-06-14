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
        v-for="product in products"
        :key="product.id"
        :title="product.title"
        :location="product.location"
        :price="product.price"
        :status="product.status"
        :tags="product.tags"
        :image="product.image"
        class="clickable-card"
        @click="goToProduct(product.id)"
      />

      <div v-if="products.length === 0" class="empty-state">
        No hay artículos publicados todavía. Crea uno nuevo para verlo aquí.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import HeroBanner from '../components/HeroBanner.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const productosStore = useProductosStore()

const products = computed(() => productosStore.products)

const goToProduct = (productId) => {
  router.push({ name: 'articulo', params: { id: productId } })
}
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
</style>