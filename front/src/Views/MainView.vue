<template>
  <div class="page-content">
    <HeroBanner />
    
    <div class="products-grid">
      <ProductCard 
        :title="articuloUnico.title"
        :location="articuloUnico.location"
        :price="articuloUnico.price"
        :status="articuloUnico.status"
        :tags="articuloUnico.tags"
        :image="articuloUnico.image"
        @click="irAlDetalle"
        class="clickable-card"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '../components/HeroBanner.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

const articuloUnico = ref({
  title: 'MacBook Pro 2019',
  location: 'Playa del Carmen',
  price: 10900,
  status: 'Buen Estado',
  tags: ['Electrónicos', 'Cambio', 'Venta'],
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop'
})

const irAlDetalle = () => {
  router.push('/articulo') // Te manda a la nueva vista del artículo
}
</script>

<style scoped>
.page-content {
  padding: 40px 40px; 
  max-width: 1440px; 
  margin: 0 auto;
}

.products-grid {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>