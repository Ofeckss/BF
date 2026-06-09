<template>
  <div class="product-card">
    <div class="image-container">
      <img :src="image" :alt="title" class="product-image" />
    </div>

    <div class="product-info">
      <h3 class="product-title">{{ title }}</h3>
      <div class="product-location">
        <span class="pin-icon">📍</span>
        {{ location }}
      </div>
    </div>

    <div class="tags-container">
      <span v-for="(tag, index) in tags" :key="index" class="tag-badge">
        {{ tag }}
      </span>
    </div>

    <div class="price-status-container">
      <span class="product-price">${{ formatPrice(price) }}</span>
      <span class="status-badge">{{ status }}</span>
    </div>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    required: true,
    default: 'Artículo sin título'
  },
  location: {
    type: String,
    default: 'Playa del Carmen'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    default: 'Buen Estado'
  },
  tags: {
    type: Array,
    default: () => []
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop' 
  }
})


const formatPrice = (value) => {
  return value.toLocaleString('es-MX')
}
</script>

<style scoped>
.product-card {
  background-color: #FFFFFF;
  border: 4px solid var(--brand-brown); 
  border-radius: 24px;
  width: 260px; 
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.product-info {
  background-color: var(--brand-cream); 
  padding: 12px 16px;
  border-bottom: 2px solid #FFFFFF;
}

.product-title {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #000000;
}

.product-location {
  font-size: 0.9rem;
  color: var(--brand-dark-gray);
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags-container {
  background-color: var(--brand-sand); 
  padding: 10px 16px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap; 
}

.tag-badge {
  background-color: var(--brand-dark-gray);
  color: white;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.price-status-container {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto; /* Empuja esta sección siempre abajo del todo */
}

.product-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--brand-red); /* Tu color rojo oscuro para el precio */
}

.status-badge {
  background-color: #D3D8B4; /* Verde seco suave para el "Buen Estado" */
  color: #2B331F;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>