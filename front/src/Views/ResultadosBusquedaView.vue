<template>
  <div class="busqueda-layout">
    
    <!-- Sidebar de filtros -->
    <aside class="filtros-sidebar">
      <h3 class="filtros-titulo">Filtros</h3>

      <div class="filtro-grupo">
        <h4>Tipo</h4>
        <ul class="filtro-lista">
          <li
            :class="{ activo: tipoTransaccion === null }"
            @click="seleccionarTipo(null)"
          >
            Todos
          </li>
          <li
            :class="{ activo: tipoTransaccion === false }"
            @click="seleccionarTipo(false)"
          >
            Venta
          </li>
          <li
            :class="{ activo: tipoTransaccion === true }"
            @click="seleccionarTipo(true)"
          >
            Trueque
          </li>
        </ul>
      </div>

      <div class="filtro-grupo" v-if="mostrarFiltroPrecio">
        <h4>Precio</h4>
        <div class="precio-inputs">
          <input
            type="number"
            min="0"
            placeholder="Mín."
            v-model.number="precioMin"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            placeholder="Máx."
            v-model.number="precioMax"
          />
        </div>
        <button class="btn-aplicar-precio" @click="buscar">Aplicar</button>
      </div>

      <div class="filtro-grupo">
        <h4>Categoría</h4>
        <ul class="filtro-lista">
          <li 
            class="categoria-item"
            :class="{ activo: categoriasSeleccionadas.length === 0 }"
            @click="limpiarCategorias"
          >
            Todas
          </li>
          <li
            v-for="cat in productosStore.categorias"
            :key="cat.id"
            class="categoria-checkbox-item"
          >
            <input
              type="checkbox"
              :id="`cat-${cat.id}`"
              :checked="categoriasSeleccionadas.includes(cat.id)"
              @change="toggleCategoria(cat.id)"
            />
            <label :for="`cat-${cat.id}`">{{ cat.nombre }}</label>
          </li>
        </ul>
      </div>

      <div class="filtro-grupo">
        <h4>Ubicación</h4>
        <ul class="filtro-lista">
          <li
            :class="{ activo: ubicacionSeleccionada === null }"
            @click="seleccionarUbicacion(null)"
          >
            Todas
          </li>
          <li
            v-for="ub in ubicaciones"
            :key="ub.id"
            :class="{ activo: ubicacionSeleccionada === ub.id }"
            @click="seleccionarUbicacion(ub.id)"
          >
            {{ ub.nombre }}
          </li>
        </ul>
      </div>

      <button
        v-if="hayFiltrosActivos"
        class="btn-limpiar-filtros"
        @click="limpiarFiltros"
      >
        Limpiar filtros
      </button>
    </aside>

    <!-- Resultados -->
    <div class="resultados-container">
      <div class="resultados-header">
        <h2 class="resultados-titulo">
          Resultados para "{{ query }}"
          <span class="resultados-count">({{ resultadosFiltrados.length }})</span>
        </h2>

        <label class="check-no-disponibles">
          <input type="checkbox" v-model="mostrarNoDisponibles" />
          Mostrar no disponibles (esta opcion se eliminara en la version final)
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import productosApi from '../services/productosApi'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productosStore = useProductosStore()

const query = computed(() => route.query.q || '')

const mostrarNoDisponibles = ref(false)

// Filtros de la sidebar
const precioMin = ref(null)
const precioMax = ref(null)
const categoriasSeleccionadas = ref([]) // Ahora es un array para múltiples selecciones
const ubicacionSeleccionada = ref(null)
const tipoTransaccion = ref(null) // null = todos, true = trueque, false = venta
const ubicaciones = ref([])

// Si es trueque no aplica filtrar por precio (normalmente es $0 o no representativo)
const mostrarFiltroPrecio = computed(() => tipoTransaccion.value !== true)

const hayFiltrosActivos = computed(() =>
  precioMin.value !== null ||
  precioMax.value !== null ||
  categoriasSeleccionadas.value.length > 0 ||
  ubicacionSeleccionada.value !== null ||
  tipoTransaccion.value !== null
)

// TODO: filtro temporal en el front. El endpoint POST /api/articulos/search
// (GetFilteredRequest) todavía no soporta filtrar por "Disponible", así que
// por ahora ocultamos los no disponibles aquí. Si el backend agrega ese
// filtro, esto debería moverse al request de searchArticulos en vez de
// filtrarse en el cliente.
const resultadosFiltrados = computed(() => {
  if (mostrarNoDisponibles.value) return productosStore.searchResults
  return productosStore.searchResults.filter((p) => p.status === 'Disponible')
})

const buscar = async () => {
  // Si hay múltiples categorías seleccionadas, hacer búsquedas por cada una y combinar resultados
  if (categoriasSeleccionadas.value.length > 0) {
    const todosResultados = []
    const idsVistos = new Set()

    for (const catId of categoriasSeleccionadas.value) {
      await productosStore.searchArticulos({
        Nombre: query.value || null,
        PrecioMin: mostrarFiltroPrecio.value ? precioMin.value ?? null : null,
        PrecioMax: mostrarFiltroPrecio.value ? precioMax.value ?? null : null,
        CategoriaId: catId,
        UbicacionId: ubicacionSeleccionada.value,
        EsTrueque: tipoTransaccion.value
      })

      // Agregar resultados sin duplicados
      productosStore.searchResults.forEach(resultado => {
        if (!idsVistos.has(resultado.id)) {
          idsVistos.add(resultado.id)
          todosResultados.push(resultado)
        }
      })
    }

    // Reemplazar los resultados con todos combinados
    productosStore.searchResults = todosResultados
  } else {
    // Si no hay categorías seleccionadas, búsqueda normal sin filtro de categoría
    productosStore.searchArticulos({
      Nombre: query.value || null,
      PrecioMin: mostrarFiltroPrecio.value ? precioMin.value ?? null : null,
      PrecioMax: mostrarFiltroPrecio.value ? precioMax.value ?? null : null,
      CategoriaId: null,
      UbicacionId: ubicacionSeleccionada.value,
      EsTrueque: tipoTransaccion.value
    })
  }
}

const seleccionarTipo = (valor) => {
  tipoTransaccion.value = tipoTransaccion.value === valor ? null : valor
  if (tipoTransaccion.value === true) {
    // Al elegir trueque, limpiamos el precio ya que se oculta el filtro
    precioMin.value = null
    precioMax.value = null
  }
  buscar()
}

const toggleCategoria = (id) => {
  const idx = categoriasSeleccionadas.value.indexOf(id)
  if (idx > -1) {
    categoriasSeleccionadas.value.splice(idx, 1)
  } else {
    categoriasSeleccionadas.value.push(id)
  }
  buscar()
}

const limpiarCategorias = () => {
  categoriasSeleccionadas.value = []
  buscar()
}

const seleccionarUbicacion = (id) => {
  ubicacionSeleccionada.value = ubicacionSeleccionada.value === id ? null : id
  buscar()
}

const limpiarFiltros = () => {
  precioMin.value = null
  precioMax.value = null
  categoriasSeleccionadas.value = []
  ubicacionSeleccionada.value = null
  tipoTransaccion.value = null
  buscar()
}

onMounted(async () => {
  if (productosStore.categorias.length === 0) {
    productosStore.fetchCategorias()
  }
  try {
    const res = await productosApi.getUbicaciones()
    ubicaciones.value = res?.data || []
  } catch (err) {
    console.warn('No se pudieron cargar ubicaciones:', err)
  }
  buscar()
})

// Si el usuario busca de nuevo desde la navbar estando ya en /buscar,
// la ruta cambia el query param y volvemos a pedir resultados
// (se mantienen los filtros de categoría/ubicación/precio activos).
watch(query, buscar)
</script>

<style scoped>
.busqueda-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 30px;
}

/* Sidebar */
.filtros-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 18px;
}

.filtros-titulo {
  font-size: 1.1rem;
  margin: 0 0 14px;
  color: var(--brand-dark-gray, #333);
}

.filtro-grupo {
  margin-bottom: 22px;
}

.filtro-grupo h4 {
  font-size: 0.95rem;
  margin: 0 0 10px;
  color: #444;
}

.precio-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.precio-inputs input {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
}

.btn-aplicar-precio {
  margin-top: 8px;
  width: 100%;
  padding: 6px 0;
  border: none;
  border-radius: 6px;
  background: var(--brand-red, #e63946);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.filtro-lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.filtro-lista li {
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
}

.filtro-lista li:hover {
  background: #f5f5f5;
}

.filtro-lista li.activo {
  background: #fdecec;
  color: var(--brand-red, #e63946);
  font-weight: 600;
}

.categoria-item:hover {
  background: #f5f5f5;
  cursor: pointer;
}

.categoria-checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  list-style: none;
}

.categoria-checkbox-item input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.categoria-checkbox-item label {
  cursor: pointer;
  flex: 1;
}

.btn-limpiar-filtros {
  width: 100%;
  padding: 8px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #555;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-limpiar-filtros:hover {
  background: #f5f5f5;
}

/* Resultados */
.resultados-container {
  flex: 1;
  min-width: 0;
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