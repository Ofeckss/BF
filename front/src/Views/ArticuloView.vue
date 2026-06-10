<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


const articulo = ref({
  title: 'MacBook Pro 2019',
  location: 'Playa del Carmen',
  price: 10900,
  status: 'Buen Estado',
  description: 'Se vende o cambia MacBook Pro 2019 en excelente estado físico y funcional. Cuenta con procesador Intel Core i7, 16GB de memoria RAM y 512GB de almacenamiento SSD. Pantalla Retina intacta sin detalles de pixeles. Se entrega con su cargador original USB-C.',
  tags: ['Electrónicos', 'Cambio', 'Venta'],
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
  owner: {
    name: 'Carlos Mendoza'
  }
})

const regresar = () => {
  router.push('/')
}

const contactarPropietario = () => {
  alert(`Abriendo chat con ${articulo.value.owner.name} para negociar el artículo: ${articulo.value.title}`)
}
</script>

<template>
  <div class="product-detail-container">
    
    <button @click="regresar" class="btn-back">
      ← Volver al inicio
    </button>

    <div class="product-columns-wrapper">
      
      <div class="media-column">
        <div class="main-image-box">
          <img :src="articulo.image" :alt="articulo.title" class="display-img" />
        </div>
      </div>

      <div class="info-column">
        
        <div class="header-info">
          <h1 class="item-title">{{ articulo.title }}</h1>
          <span class="status-badge">{{ articulo.status }}</span>
        </div>

        <div class="location-box">
          <span class="pin-icon">📍</span>
          <span class="location-text">{{ articulo.location }}</span>
        </div>

        <div class="price-box">
          <span class="price-label">Precio estimado:</span>
          <h2 class="price-value">${{ articulo.price.toLocaleString('es-MX') }}</h2>
        </div>

        <div class="tags-row">
          <span v-for="(tag, index) in articulo.tags" :key="index" class="tag-pill">
            {{ tag }}
          </span>
        </div>

        <div class="description-card">
          <h3>Descripción del Artículo</h3>
          <p>{{ articulo.description }}</p>
        </div>

        <div class="owner-card">
          <div class="owner-avatar">
            {{ articulo.owner.name.charAt(0) }}
          </div>
          <div class="owner-details">
            <h4>{{ articulo.owner.name }}</h4>
          </div>
        </div>

        <div class="action-buttons-stack">
          <button @click="contactarPropietario" class="btn-primary-action">
            Proponer Trueque / Comprar
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

.btn-back:hover {
  color: var(--brand-orange);
}


.product-columns-wrapper {
  display: grid;
  grid-template-columns: 1.2fr 1fr; 
  gap: 40px;
  align-items: start;
}

/* --- ESTILOS COLUMNA IZQUIERDA --- */
.media-column {
  width: 100%;
}

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

/* --- ESTILOS COLUMNA DERECHA --- */
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

.owner-details p {
  margin: 0;
  font-size: 0.85rem;
  color: #666666;
}

.action-buttons-stack {
  margin-top: 10px;
}

.btn-primary-action {
  background-color: var(--brand-orange);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 18px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 14px rgba(250, 39, 0, 0.3);
  transition: background-color 0.2s, transform 0.1s;
}

.btn-primary-action:hover {
  background-color: var(--brand-red);
}

/* Responsivo básico si la pantalla se reduce */
@media (max-width: 900px) {
  .product-columns-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .main-image-box {
    height: 350px;
  }
}
</style>