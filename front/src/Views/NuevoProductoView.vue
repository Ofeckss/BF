<template>
  <div class="page">
    <h1 class="page-title">Publicar Producto</h1>

    <div class="layout">
      <!-- Columna izquierda -->
      <div class="left-col">
        <div class="form-group">
          <label>Titulo</label>
          <input v-model="form.title" type="text" />
        </div>

        <div class="form-group">
          <label>Precio</label>
          <input v-model.number="form.price" type="number" min="0" />
        </div>

        <div class="form-group">
          <label>Descripcion</label>
          <textarea v-model="form.description" rows="6"></textarea>
        </div>

        <div class="form-group">
          <label>Añadir Categorias / Etiquetas</label>
          <div class="chip-group">
            <button
              v-for="cat in productosStore.categorias"
              :key="cat.id"
              type="button"
              class="chip"
              :class="{ active: form.categoria_id === cat.id }"
              @click="form.categoria_id = cat.id; form.tags = [cat.nombre]"
            >
              {{ cat.nombre }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Estado Del producto</label>
          <div class="chip-group">
            <button
              v-for="est in estados"
              :key="est.label"
              type="button"
              class="chip"
              :class="{ active: form.disponible === est.value && form.estadoLabel === est.label }"
              @click="form.disponible = est.value; form.estadoLabel = est.label"
            >
              {{ est.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Tipo de Publicacion</label>
          <div class="chip-group">
            <button
              v-for="tipo in tipos"
              :key="tipo.label"
              type="button"
              class="chip"
              :class="{ active: form.tipoLabel === tipo.label }"
              @click="form.trueque = tipo.value; form.tipoLabel = tipo.label"
            >
              {{ tipo.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="right-col">
        <div
          class="upload-zone"
          :class="{ 'drag-over': isDragging, 'has-image': previewUrl }"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <img v-if="previewUrl" :src="previewUrl" class="preview-img" alt="preview" />
          <div v-else class="upload-placeholder">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="10" fill="var(--brand-orange)" />
                <path d="M24 32V16M24 16L17 23M24 16L31 23" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 36h20" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="upload-formats">PNG, JPG, WEBP</p>
            <p class="upload-text">Haz clic o arrastra imágenes aquí</p>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            class="hidden-input"
            @change="handleFileChange"
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button class="btn-publish" :disabled="loading" @click="handleSubmit">
          {{ loading ? 'Publicando...' : 'Publicar Producto' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'

const router = useRouter()
const productosStore = useProductosStore()

const estados = [
  { label: 'Nuevo',       value: 1 },
  { label: 'Como Nuevo',  value: 1 },
  { label: 'Buen Estado', value: 1 },
  { label: 'Mal Estado',  value: 0 }
]

const tipos = [
  { label: 'Venta',  value: 0 },
  { label: 'Cambio', value: 1 },
  { label: 'Ambos',  value: 1 }
]

const form = reactive({
  title: '',
  description: '',
  vendedor_id: 1, // Debe obtener el id del usuario
  categoria_id: null,
  trueque: 0,
  disponible: 1,
  price: '',
  image: '',
  /*tags: [],
  estadoLabel: '',
  tipoLabel: '',
  location: 'Playa del Carmen',*/
})
const previewUrl = ref('')
const isDragging = ref(false)
const fileInput = ref(null)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  productosStore.fetchCategorias()
})

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) loadPreview(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) loadPreview(file)
}

const loadPreview = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    form.image = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  error.value = ''
  if (!form.title.trim()) { error.value = 'El título es obligatorio.'; return }
  if (!form.price)         { error.value = 'El precio es obligatorio.'; return }

  loading.value = true
  try {
    await productosStore.addProduct({ ...form })
    router.push('/')
  } catch (err) {
    error.value = 'No se pudo publicar el artículo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  padding: 36px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #000;
  margin: 0 0 32px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111;
}

.form-group input,
.form-group textarea {
  border: 1.5px solid #ccc;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 1rem;
  background: #fff;
  color: #111;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--brand-orange);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  border: 1.5px solid #bbb;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.9rem;
  font-weight: 500;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  border-color: var(--brand-orange);
  color: var(--brand-orange);
}

.chip.active {
  background: var(--brand-orange);
  border-color: var(--brand-orange);
  color: #fff;
  font-weight: 700;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 20px;
}

.upload-zone {
  width: 100%;
  min-height: 300px;
  background: #fffbef;
  border: 2.5px dashed #c8a96e;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}

.upload-zone.drag-over {
  border-color: var(--brand-orange);
  background: #fff3d6;
}

.upload-zone.has-image {
  border-style: solid;
  border-color: var(--brand-brown);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  text-align: center;
}

.upload-formats {
  font-size: 0.9rem;
  color: #aaa;
  margin: 0;
}

.upload-text {
  font-size: 1.05rem;
  color: #888;
  margin: 0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 300px;
}

.hidden-input {
  display: none;
}

.error-msg {
  color: var(--brand-orange);
  font-weight: 600;
  margin: 0;
}

.btn-publish {
  background: var(--brand-orange);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 18px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;
}

.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-publish:hover:not(:disabled) {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .right-col {
    position: static;
  }
}
</style>
