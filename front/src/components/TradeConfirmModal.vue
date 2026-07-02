<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-box">

      <button class="modal-close" @click="cerrar" title="Cerrar">&times;</button>

      <h2 class="modal-title">Tus artículos a intercambiar</h2>

      <div v-if="cargando" class="modal-estado">Cargando información del trato...</div>
      <div v-else-if="errorMsg && !transaccion" class="modal-estado modal-error">
        {{ errorMsg }}
        <button class="btn-reintentar-modal" @click="cargarTodo">Reintentar</button>
      </div>

      <template v-else>
        <p v-if="errorMsg" class="modal-error-inline">{{ errorMsg }}</p>

        <!-- Mis artículos: los que puedo ofrecer -->
        <div class="articulos-list">
          <div v-if="misArticulosDisponibles.length === 0" class="modal-vacio">
            No tienes artículos publicados para ofrecer.
          </div>
          <label
            v-for="art in misArticulosDisponibles"
            :key="art.id"
            class="articulo-row"
            :class="{ agregado: idsYaAgregados.has(art.id) }"
          >
            <img v-if="art.image" :src="art.image" class="articulo-thumb" />
            <div v-else class="articulo-thumb placeholder"></div>
            <span class="articulo-nombre">{{ art.title }}</span>
            <input
              type="checkbox"
              class="articulo-check"
              :checked="idsYaAgregados.has(art.id)"
              :disabled="idsYaAgregados.has(art.id) || agregando"
              @change="agregarArticulo(art.id)"
            />
          </label>
        </div>

        <!-- Precio: solo si no es trueque puro y quien confirma es el comprador -->
        <div v-if="!transaccion?.esTrueque && !esVendedor" class="precio-row">
          <label for="precio-oferta">Precio acordado (MXN)</label>
          <input
            id="precio-oferta"
            v-model.number="precioOferta"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <!-- Lo que el otro usuario ofrece -->
        <h3 class="modal-subtitle">{{ nombreOtro }} te dará:</h3>
        <div class="otro-articulos">
          <div v-if="articulosOtro.length === 0" class="modal-vacio small">
            Aún no ha agregado artículos.
          </div>
          <div v-for="art in articulosOtro" :key="art.id" class="otro-card">
            <img v-if="art.imagen" :src="art.imagen" class="otro-thumb" />
            <div v-else class="otro-thumb placeholder"></div>
            <span>{{ art.nombre }}</span>
          </div>
        </div>

        <p v-if="tratoCompletado" class="modal-completado">
          🎉 ¡Trato completado! Ambos confirmaron el intercambio.
        </p>
        <p v-else-if="yaConfirme" class="modal-espera">
          Ya confirmaste tu parte. Esperando confirmación de {{ nombreOtro }}...
        </p>

        <div class="modal-actions">
          <button v-if="tratoCompletado" class="btn-finalizar-modal" @click="cerrar">
            Cerrar
          </button>
          <template v-else>
            <button class="btn-cancelar" @click="cancelarTrato" :disabled="procesando">
              Cancelar trato
            </button>
            <button class="btn-finalizar-modal" @click="confirmarTrato" :disabled="procesando || yaConfirme">
              {{ yaConfirme ? 'Esperando...' : 'Finalizar' }}
            </button>
          </template>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import transaccionesApi from '../services/transaccionesApi'
import productosApi from '../services/productosApi'

const props = defineProps({
  chatId: { type: String, required: true },
  articuloId: { type: String, required: true }
})
const emit = defineEmits(['close'])

const auth = useAuthStore()

const cargando = ref(true)
const procesando = ref(false)
const agregando = ref(false)
const errorMsg = ref('')
const yaConfirme = ref(false)
const tratoCompletado = ref(false) // true cuando /transacciones/status confirma que ambos ya dieron OK

const esVendedor = ref(false)
const nombreOtro = ref('el otro usuario')
const precioOferta = ref(null)

const transaccion = ref(null) // GetTransaccionResponse
const detalles = ref([])      // GetDetalleResponse[]
const misArticulosPublicados = ref([]) // mis productos publicados (para poder ofrecerlos)

let pollingInterval = null
let statusPollingInterval = null

// ids de MIS artículos ya agregados a esta transacción
const idsYaAgregados = computed(() => {
  const mios = detalles.value.filter(d => d.ofrecidoVendedor === esVendedor.value)
  return new Set(mios.map(d => d.articulo.id))
})

// lo que el OTRO usuario ya ofreció
const articulosOtro = computed(() => {
  const otros = detalles.value.filter(d => d.ofrecidoVendedor !== esVendedor.value)
  return otros.map(d => ({ id: d.articulo.id, nombre: d.articulo.nombre, imagen: d.articulo.url || '' }))
})

const misArticulosDisponibles = computed(() => misArticulosPublicados.value)

const cerrar = () => emit('close')

async function obtenerOCrearTransaccion(esTruequeDefault) {
  try {
    const transRes = await transaccionesApi.getByChatId(props.chatId)
    return transRes.data
  } catch (e) {
    // si no existe aún, se crea y se vuelve a pedir
    await transaccionesApi.create(props.chatId, Boolean(esTruequeDefault))
    const transRes = await transaccionesApi.getByChatId(props.chatId)
    return transRes.data
  }
}

async function cargarTodo() {
  cargando.value = true
  errorMsg.value = ''
  try {
    // 1. Artículo principal del chat (independiente, va en paralelo con "mis artículos")
    const [artRes, misRes] = await Promise.all([
      productosApi.getById(props.articuloId),
      productosApi.getByUsuarioId(auth.user.id)
    ])

    const articuloPrincipal = artRes.data
    const vendedorId = articuloPrincipal.vendedorId || articuloPrincipal.vendedor?.vendedorId
    esVendedor.value = String(vendedorId) === String(auth.user.id)

    misArticulosPublicados.value = (misRes.data || []).map(a => ({
      id: a.id,
      title: a.nombre,
      image: a.url || ''
    }))

    // 2. La transacción depende de saber esTrueque del artículo, así que va después,
    //    pero detalles se puede pedir apenas la transacción exista.
    transaccion.value = await obtenerOCrearTransaccion(articuloPrincipal.esTrueque)

    const detRes = await transaccionesApi.getDetalles(props.chatId)
    detalles.value = detRes.data || []
  } catch (e) {
    console.error('Error cargando el trato:', e)
    errorMsg.value = 'No se pudo cargar la información del trato. Puede que el servidor esté iniciando, intenta de nuevo en unos segundos.'
  } finally {
    cargando.value = false
  }
}

async function refrescarDetalles() {
  try {
    const detRes = await transaccionesApi.getDetalles(props.chatId)
    detalles.value = detRes.data || []
    if (errorMsg.value) errorMsg.value = ''
  } catch (e) {
    console.warn('No se pudo refrescar detalles (se reintentará en el próximo ciclo):', e)
  }
}

async function agregarArticulo(articuloId) {
  if (idsYaAgregados.value.has(articuloId) || agregando.value) return
  agregando.value = true
  try {
    console.log('[agregarArticulo] payload -> chatId:', props.chatId, '| articuloId:', articuloId)
    await transaccionesApi.addDetalle(props.chatId, articuloId)
    await refrescarDetalles()
  } catch (e) {
    console.error('Error agregando artículo:', e)
    errorMsg.value = 'No se pudo agregar el artículo. Intenta de nuevo.'
  } finally {
    agregando.value = false
  }
}

async function confirmarTrato() {
  procesando.value = true
  errorMsg.value = ''
  try {
    const misIds = Array.from(idsYaAgregados.value)
    const precio = !transaccion.value?.esTrueque && !esVendedor.value ? precioOferta.value : null
    console.log('[confirmarTrato] payload -> chatId:', props.chatId, '| articulos:', misIds, '| precio:', precio)
    await transaccionesApi.confirmar(props.chatId, misIds, precio)
    yaConfirme.value = true
  } catch (e) {
    console.error('Error confirmando trato:', e)
    errorMsg.value = 'No se pudo confirmar el trato. Intenta de nuevo.'
  } finally {
    procesando.value = false
  }
}

async function cancelarTrato() {
  procesando.value = true
  errorMsg.value = ''
  try {
    console.log('[cancelarTrato] chatId:', props.chatId)
    await transaccionesApi.cancelar(props.chatId)
    emit('close')
  } catch (e) {
    console.error('Error cancelando trato:', e)
    errorMsg.value = 'No se pudo cancelar el trato.'
  } finally {
    procesando.value = false
  }
}

// Revisa si ambos usuarios ya confirmaron. NOTA: mientras el backend no
// corrija GetStatus (ver comentario en transaccionesApi.js), esta llamada
// va a fallar silenciosamente y el modal se va a quedar en "Esperando...".
// En cuanto se corrija, esto empieza a funcionar solo, sin tocar más código.
async function verificarStatus() {
  try {
    console.log('[verificarStatus] chatId enviado:', props.chatId)
    const res = await transaccionesApi.getStatus(props.chatId)
    console.log('[verificarStatus] respuesta recibida:', res.data)
    if (res.data === true) {
      tratoCompletado.value = true
      if (pollingInterval) clearInterval(pollingInterval)
      if (statusPollingInterval) clearInterval(statusPollingInterval)
    }
  } catch (e) {
    console.warn('[verificarStatus] error esperado hasta que backend arregle el endpoint:', e.response?.status, e.response?.data)
  }
}

onMounted(async () => {
  console.log('[TradeConfirmModal] montado con chatId:', props.chatId, '| articuloId:', props.articuloId)
  await cargarTodo()
  // refresca lo que agrega el otro usuario. 7s en vez de 4s para no saturar
  // el backend con más polling encima del que ya hace el chat de mensajes.
  pollingInterval = setInterval(refrescarDetalles, 7000)
  statusPollingInterval = setInterval(verificarStatus, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
  if (statusPollingInterval) clearInterval(statusPollingInterval)
})
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  max-height: 88vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #999;
  cursor: pointer;
}
.modal-close:hover { color: #1a1a1a; }

.modal-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 18px;
}

.modal-subtitle {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 18px 0 10px;
}

.modal-estado {
  text-align: center;
  padding: 30px 0;
  color: #888;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.modal-error { color: #d92100; }
.modal-error-inline {
  color: #d92100;
  font-size: 0.8rem;
  text-align: center;
  margin: -8px 0 14px;
}

.btn-reintentar-modal {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-reintentar-modal:hover { background-color: #d92100; }

.modal-vacio {
  color: #aaa;
  font-size: 0.85rem;
  text-align: center;
  padding: 10px 0;
}
.modal-vacio.small { padding: 6px 0; }

.articulos-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.articulo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #FA2700;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.articulo-row.agregado { background-color: #fff3ef; }

.articulo-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #e8ddd0;
}
.articulo-thumb.placeholder { background: #e8ddd0; }

.articulo-nombre {
  flex: 1;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
}

.articulo-check {
  width: 20px;
  height: 20px;
  accent-color: #FA2700;
  cursor: pointer;
}
.articulo-check:disabled { cursor: default; }

.precio-row {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.precio-row label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #555;
}
.precio-row input {
  border: 1.5px solid #e8ddd0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  outline: none;
}
.precio-row input:focus { border-color: #FA2700; }

.otro-articulos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.otro-card {
  border: 1.5px solid #FA2700;
  border-radius: 10px;
  padding: 8px;
  width: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.otro-card span {
  font-size: 0.72rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

.otro-thumb {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  object-fit: cover;
  background: #e8ddd0;
}
.otro-thumb.placeholder { background: #e8ddd0; }

.modal-espera {
  text-align: center;
  font-size: 0.82rem;
  color: #888;
  margin: 14px 0 0;
}

.modal-completado {
  text-align: center;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a1a1a;
  background: #fff6b2;
  border-radius: 10px;
  padding: 12px;
  margin: 14px 0 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancelar,
.btn-finalizar-modal {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-cancelar {
  background: #f0f0f0;
  color: #555;
}
.btn-cancelar:hover:not(:disabled) { background: #e2e2e2; }

.btn-finalizar-modal {
  background-color: #FA2700;
  color: white;
}
.btn-finalizar-modal:hover:not(:disabled) { background-color: #d92100; }

.btn-cancelar:disabled,
.btn-finalizar-modal:disabled { opacity: 0.5; cursor: not-allowed; }
</style>