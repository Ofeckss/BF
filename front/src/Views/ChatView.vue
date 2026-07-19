<template>
  <div class="chat-page">

    <aside class="chat-sidebar">
      <div class="sidebar-header">
        <h2>Mensajes</h2>
      </div>

      <div v-if="chatStore.loading" class="sidebar-empty">
        Cargando conversaciones...
      </div>
      <div v-else-if="chatStore.loadError" class="sidebar-empty sidebar-error">
        {{ chatStore.loadError }}
        <button class="btn-reintentar" @click="recargarChats">Reintentar</button>
      </div>
      <div v-else-if="chatsVisibles.length === 0" class="sidebar-empty">
        No tienes conversaciones aún.
      </div>

      <div class="chat-list">
        <ChatCard
          v-for="chat in chatsActivos"
          :key="chat.id"
          :articuloNombre="chat.articuloNombre"
          :vendedorNombre="chat.vendedorNombre"
          :imagen="chat.imagen"
          :ultimoMensaje="chat.ultimoMensaje"
          :hora="chat.hora"
          :unread="chat.unread"
          :isActive="chatActivo?.id === chat.id"
          :isArchived="false"
          @select="abrirChat(chat)"
          @archive="archivarChat(chat)"
          @delete="eliminarChat(chat)"
        />
      </div>

      <div v-if="chatsArchivados.length > 0" class="archivados-section">
        <button class="archivados-toggle" @click="mostrarArchivados = !mostrarArchivados">
          <span>Archivados ({{ chatsArchivados.length }})</span>
          <span class="archivados-caret" :class="{ open: mostrarArchivados }">▾</span>
        </button>

        <div v-if="mostrarArchivados" class="chat-list">
          <ChatCard
            v-for="chat in chatsArchivados"
            :key="chat.id"
            :articuloNombre="chat.articuloNombre"
            :vendedorNombre="chat.vendedorNombre"
            :imagen="chat.imagen"
            :ultimoMensaje="chat.ultimoMensaje"
            :hora="chat.hora"
            :unread="chat.unread"
            :isActive="chatActivo?.id === chat.id"
            :isArchived="true"
            @select="abrirChat(chat)"
            @unarchive="desarchivarChat(chat)"
            @delete="eliminarChat(chat)"
          />
        </div>
      </div>
    </aside>

    <main class="chat-panel">

      <div v-if="!chatActivo" class="panel-empty">
        <svg viewBox="0 0 24 24" fill="none" width="56" height="56">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
        </svg>
        <p>Selecciona una conversación para empezar</p>
      </div>

      <template v-else>
        <div v-if="avisoPago" :class="['pago-banner', avisoPago.tipo === 'exitoso' ? 'pago-exitoso' : 'pago-cancelado']">
          <span v-if="avisoPago.tipo === 'exitoso'">✅ Pago confirmado correctamente</span>
          <span v-else>⚠️ El pago fue cancelado</span>
          <button class="pago-banner-close" @click="avisoPago = null">x</button>
        </div>        
        <div class="panel-header">
          <div class="panel-header-info">
            <div class="panel-img-wrap">
              <img v-if="chatActivo.imagen" :src="chatActivo.imagen" :alt="chatActivo.articuloNombre" />
              <div v-else class="panel-img-placeholder">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div>
              <p class="panel-articulo-nombre">{{ chatActivo.articuloNombre }}</p>
              <p class="panel-vendedor-nombre">{{ chatActivo.vendedorNombre }}</p>
            </div>
          </div>
          <div class="panel-header-actions">
            <button
              class="btn-finalizar"
              :disabled="!chatActivo.chatId"
              :title="!chatActivo.chatId ? 'Espera un momento, el chat se está sincronizando...' : ''"
              @click="mostrarModalFinalizar = true"
            >
              Finalizar trato
            </button>
          </div>
        </div>

        <div class="messages-area" ref="messagesRef">
          <div v-if="mensajes.length === 0" class="messages-empty">
            <p>Inicia la conversación sobre <strong>{{ chatActivo.articuloNombre }}</strong></p>
          </div>
          <div
            v-for="msg in mensajes"
            :key="msg.id"
            :class="['msg-bubble', msg.esMio ? 'msg-mio' : 'msg-otro']"
          >
            <div
              v-if="msg.esOferta"
              class="oferta-card"
              role="button"
              tabindex="0"
              title="Ver artículo completo"
              @click="irAlArticulo(msg.oferta.articuloId)"
              @keydown.enter="irAlArticulo(msg.oferta.articuloId)"
            >
              <img v-if="msg.oferta.url" :src="msg.oferta.url" class="oferta-card-thumb" />
              <div v-else class="oferta-card-thumb placeholder"></div>
              <div class="oferta-card-body">
                <span class="oferta-card-label">{{ msg.esMio ? 'Ofreciste' : 'Te ofreció' }}</span>
                <span class="oferta-card-nombre">{{ msg.oferta.nombre }}</span>
              </div>
            </div>
            <p v-else>{{ msg.texto }}</p>
            <span class="msg-hora">{{ msg.hora }}</span>
          </div>
        </div>

        <div class="input-area">
          <div class="attach-wrap">
            <button
              class="btn-attach"
              title="Ofrecer un artículo"
              :disabled="!chatActivo.chatId"
              @click="abrirSelectorArticulo"
            >
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" fill="currentColor"/>
              </svg>
            </button>

            <div v-if="mostrarSelectorArticulo" class="attach-popover" @click.self="mostrarSelectorArticulo = false">
              <div class="attach-panel">
                <p class="attach-title">Ofrecer un artículo</p>

                <div v-if="cargandoOferta" class="attach-estado">Cargando tus artículos...</div>
                <div v-else-if="errorOferta" class="attach-estado attach-error">{{ errorOferta }}</div>
                <div v-else-if="misArticulosOferta.length === 0" class="attach-estado">
                  No tienes artículos disponibles para ofrecer.
                </div>

                <div v-else class="attach-list">
                  <button
                    v-for="art in misArticulosOferta"
                    :key="art.id"
                    class="attach-item"
                    :disabled="enviandoOferta === art.id"
                    @click="enviarArticuloAlChat(art)"
                  >
                    <img v-if="art.url" :src="art.url" class="attach-thumb" />
                    <div v-else class="attach-thumb placeholder"></div>
                    <span class="attach-nombre">{{ art.nombre }}</span>
                    <span v-if="enviandoOferta === art.id" class="attach-enviando">Enviando...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button class="btn-emoji" title="Emoji">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
            </svg>
          </button>
          <input
            v-model="nuevoMensaje"
            type="text"
            placeholder="Escribe un mensaje..."
            class="msg-input"
            @keydown.enter="enviarMensaje"
          />
          <button class="btn-send" @click="enviarMensaje" :disabled="!nuevoMensaje.trim()">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </template>

    </main>

    <TradeConfirmModal
      v-if="mostrarModalFinalizar && chatActivo?.chatId"
      :chat-id="chatActivo.chatId"
      :articulo-id="chatActivo.articuloId"
      :channel-url="chatActivo.channelUrl"
      @close="mostrarModalFinalizar = false"
    />

    <RatingModal
      v-if="ratingPostPago"
      :nombre-otro="ratingPostPago.nombreOtro"
      @rate="enviarCalificacionPostPago"
      @close="ratingPostPago = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useChatStore } from '../stores/chatStore'
import ChatCard from '../components/ChatCard.vue'
import TradeConfirmModal from '../components/TradeConfirmModal.vue'
import RatingModal from '../components/RatingModal.vue'
import * as sendbirdApi from '../services/sendbirdApi'
import transaccionesApi from '../services/transaccionesApi'
import productosApi from '../services/productosApi'
import usuariosApi from '../services/usuariosApi'

const auth = useAuthStore()
const chatStore = useChatStore()
const route = useRoute()
const router = useRouter()

const chats = ref([])
const chatActivo = ref(null)

// --- Archivar / eliminar chats ---
// Se guarda localmente (por usuario) igual que la bandera de "ya calificado".
// No requiere cambios de backend: es una preferencia de vista, no un dato
// que el otro usuario necesite ver. Se identifica cada chat por channelUrl
// porque es el único id que siempre está disponible (chatId a veces tarda
// en sincronizarse).
const archivadosIds = ref(new Set())
const eliminadosIds = ref(new Set())
const mostrarArchivados = ref(false)
const mensajes = ref([])
const nuevoMensaje = ref('')
const messagesRef = ref(null)
const mostrarModalFinalizar = ref(false)
const avisoPago = ref(null)
const ratingPostPago = ref(null) // { otroUserId, nombreOtro, chatId } o null
let pollingInterval = null

// --- Ofrecer un artículo en el chat ---
const mostrarSelectorArticulo = ref(false)
const misArticulosOferta = ref([])
const cargandoOferta = ref(false)
const errorOferta = ref('')
const enviandoOferta = ref(null) // id del articulo que se está enviando
const idsYaOfrecidos = ref(new Set()) // ids de MIS artículos ya ofrecidos en este chat

async function inicializarChats() {
  await chatStore.loadChannels(auth.user.id)
  chats.value = chatStore.channels
  const chatIdDesdeUrl = route.query.chatId
  const pagoDesdeUrl = route.query.pago

   if (chatIdDesdeUrl) {
    const canalPorPago = chats.value.find(c => c.chatId === chatIdDesdeUrl)
    if (canalPorPago) {
      await abrirChat(canalPorPago)
      if (pagoDesdeUrl === 'exitoso' || pagoDesdeUrl === 'cancelado') {
        avisoPago.value = { tipo: pagoDesdeUrl }
        setTimeout(() => { avisoPago.value = null }, 6000)
        if (pagoDesdeUrl === 'exitoso') {
          await intentarMostrarRatingPostPago(canalPorPago)
        }
      }
      return
    } else {
      console.warn('[inicializarChats] chatId de la URL no encontrado en los canales cargados:', chatIdDesdeUrl)
    }
  }


  if (chatStore.activeChannelUrl) {
    const canal = chats.value.find(c => c.channelUrl === chatStore.activeChannelUrl)
    if (canal) {
      await abrirChat(canal)
    } else {
      const meta = chatStore.activeChannel
      const nuevo = {
        id: chatStore.activeChannelUrl,
        chatId: meta?.chatId || null,
        articuloId: meta?.articuloId || null,
        channelUrl: chatStore.activeChannelUrl,
        articuloNombre: meta?.articuloNombre || 'Artículo',
        vendedorNombre: meta?.vendedorNombre || '',
        imagen: meta?.imagen || '',
        ultimoMensaje: '',
        hora: '',
        unread: 0
      }
      chats.value.unshift(nuevo)
      await abrirChat(nuevo)
    }
  }
}

const claveRatingLocal = (chatId) => `bartify_rated_${chatId}_${auth.user.id}`

const claveArchivados = () => `bartify_chats_archivados_${auth.user.id}`
const claveEliminados = () => `bartify_chats_eliminados_${auth.user.id}`

function cargarArchivadosYEliminados() {
  try {
    archivadosIds.value = new Set(JSON.parse(localStorage.getItem(claveArchivados()) || '[]'))
  } catch (e) {
    archivadosIds.value = new Set()
  }
  try {
    eliminadosIds.value = new Set(JSON.parse(localStorage.getItem(claveEliminados()) || '[]'))
  } catch (e) {
    eliminadosIds.value = new Set()
  }
}

function guardarArchivados() {
  localStorage.setItem(claveArchivados(), JSON.stringify(Array.from(archivadosIds.value)))
}

function guardarEliminados() {
  localStorage.setItem(claveEliminados(), JSON.stringify(Array.from(eliminadosIds.value)))
}

function archivarChat(chat) {
  archivadosIds.value = new Set(archivadosIds.value).add(chat.channelUrl)
  guardarArchivados()
}

function desarchivarChat(chat) {
  const nuevo = new Set(archivadosIds.value)
  nuevo.delete(chat.channelUrl)
  archivadosIds.value = nuevo
  guardarArchivados()
}

// "Eliminar" solo la quita de TU bandeja (localStorage); no borra los
// mensajes de Sendbird ni afecta lo que ve el otro usuario. Es la opción
// segura sin tener que agregar un endpoint nuevo en el backend.
function eliminarChat(chat) {
  const confirmado = confirm(
    `¿Eliminar la conversación sobre "${chat.articuloNombre}" con ${chat.vendedorNombre}? Esto solo la quita de tu bandeja, no borra los mensajes.`
  )
  if (!confirmado) return

  const nuevoElim = new Set(eliminadosIds.value).add(chat.channelUrl)
  eliminadosIds.value = nuevoElim
  guardarEliminados()

  if (archivadosIds.value.has(chat.channelUrl)) desarchivarChat(chat)

  if (chatActivo.value?.channelUrl === chat.channelUrl) {
    chatActivo.value = null
    if (pollingInterval) clearInterval(pollingInterval)
  }
}

// Chats visibles (sin los "eliminados"), separados en activos/archivados
const chatsVisibles = computed(() => chats.value.filter(c => !eliminadosIds.value.has(c.channelUrl)))
const chatsActivos = computed(() => chatsVisibles.value.filter(c => !archivadosIds.value.has(c.channelUrl)))
const chatsArchivados = computed(() => chatsVisibles.value.filter(c => archivadosIds.value.has(c.channelUrl)))

// Solo aplica al comprador: es quien vuelve de Stripe. El vendedor de una
// venta califica al comprador desde su propio TradeConfirmModal cuando
// verificarStatus detecta que el trato se completó (ver ese componente).
async function intentarMostrarRatingPostPago(canal) {
  if (!canal?.chatId || localStorage.getItem(claveRatingLocal(canal.chatId))) return

  try {
    const artRes = await productosApi.getById(canal.articuloId)
    const vendedorId = artRes.data?.vendedorId || artRes.data?.vendedor?.vendedorId
    if (!vendedorId || String(vendedorId) === String(auth.user.id)) return

    ratingPostPago.value = {
      chatId: canal.chatId,
      otroUserId: vendedorId,
      nombreOtro: canal.vendedorNombre || 'el vendedor'
    }
  } catch (e) {
    console.warn('No se pudo resolver el vendedor para calificar:', e)
  }
}

async function enviarCalificacionPostPago(valor) {
  const info = ratingPostPago.value
  if (!info) return
  try {
    await usuariosApi.rate(info.otroUserId, valor)
    localStorage.setItem(claveRatingLocal(info.chatId), '1')
  } catch (e) {
    console.error('No se pudo enviar la calificación:', e)
  } finally {
    ratingPostPago.value = null
  }
}

const recargarChats = () => inicializarChats()

onMounted(() => {
  cargarArchivadosYEliminados()
  inicializarChats()
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

const cargarMensajes = async (channelUrl) => {
  if (!auth.user?.id) {
    console.warn('[cargarMensajes] auth.user aún no está listo, se aborta esta carga')
    return
  }

  const rawMensajes = await sendbirdApi.getMessages(channelUrl)
  mensajes.value = rawMensajes.map(m => {
    const esOferta = m.custom_type === 'oferta_articulo'
    let oferta = null
    if (esOferta && m.data) {
      try { oferta = JSON.parse(m.data) } catch (e) { oferta = null }
    }
    return {
      id: m.message_id,
      texto: m.message,
      esOferta: esOferta && !!oferta,
      oferta,
      esMio: cleanId(m.user?.user_id) === cleanId(auth.user?.id),
      hora: new Date(m.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
  })
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

// Resuelve el chatId real cuando el chat se abrió como "provisional"
// (chat recién creado y chatStore todavía no lo sincronizó con chatId).
async function resolverChatIdReal(chat, intentos = 5, delayMs = 800) {
  if (chat.chatId) {
    console.log('[resolverChatIdReal] ya tenía chatId:', chat.chatId)
    return chat.chatId
  }

  for (let i = 0; i < intentos; i++) {
    await new Promise(res => setTimeout(res, delayMs))
    await chatStore.loadChannels(auth.user.id)
    chats.value = chatStore.channels

    const match = chats.value.find(c => c.channelUrl === chat.channelUrl)
    console.log(`[resolverChatIdReal] intento ${i + 1}/${intentos}:`, match?.chatId || 'sin match aún')
    if (match?.chatId) {
      chat.chatId = match.chatId
      if (chatActivo.value?.channelUrl === chat.channelUrl) {
        chatActivo.value.chatId = match.chatId
      }
      return match.chatId
    }
  }

  console.warn('[resolverChatIdReal] no se pudo resolver el chatId tras', intentos, 'intentos')
  return null
}

const abrirChat = async (chat) => {
  if (pollingInterval) clearInterval(pollingInterval)

  chatActivo.value = chat
  //console.log('[abrirChat] chat recibido:', chat)
  //console.log('[abrirChat] chatId:', chat.chatId, '| channelUrl:', chat.channelUrl)

  chatStore.setActiveChannel(chat)
  mensajes.value = []
  mostrarModalFinalizar.value = false
  mostrarSelectorArticulo.value = false
  idsYaOfrecidos.value = new Set()

  await cargarMensajes(chat.channelUrl)

  if (!chat.chatId) {
    resolverChatIdReal(chat)
  }

  pollingInterval = setInterval(() => {
    if (chatActivo.value?.channelUrl === chat.channelUrl) {
      cargarMensajes(chat.channelUrl)
    }
  }, 4000)
}

const cleanId = (id) => String(id).replace('@', '_at_').replace(/\./g, '_')

function irAlArticulo(articuloId) {
  if (!articuloId) return
  router.push({ name: 'articulo', params: { id: articuloId } })
}

const enviarMensaje = async () => {
  const texto = nuevoMensaje.value.trim()
  if (!texto || !chatActivo.value) return
  nuevoMensaje.value = ''
  await sendbirdApi.sendMessage(chatActivo.value.channelUrl, auth.user.id, texto)
  await cargarMensajes(chatActivo.value.channelUrl)
}

// Determina qué de MIS artículos ya fueron ofrecidos en esta transacción,
// para no dejar mandarlos otra vez.
async function obtenerIdsYaOfrecidos() {
  try {
    const [artRes, detRes] = await Promise.all([
      productosApi.getById(chatActivo.value.articuloId),
      transaccionesApi.getDetalles(chatActivo.value.chatId)
    ])
    const vendedorId = artRes.data?.vendedorId || artRes.data?.vendedor?.vendedorId
    const esVendedor = String(vendedorId) === String(auth.user.id)
    const detalles = detRes.data || []
    return new Set(
      detalles.filter(d => d.ofrecidoVendedor === esVendedor).map(d => d.articulo.id)
    )
  } catch (e) {
    return new Set()
  }
}

const abrirSelectorArticulo = async () => {
  mostrarSelectorArticulo.value = !mostrarSelectorArticulo.value
  if (!mostrarSelectorArticulo.value) return

  cargandoOferta.value = true
  errorOferta.value = ''
  try {
    const chatId = await resolverChatIdReal(chatActivo.value)
    console.log('[abrirSelectorArticulo] chatId resuelto:', chatId)
    if (!chatId) {
      errorOferta.value = 'Este chat todavía se está sincronizando. Espera unos segundos e inténtalo de nuevo.'
      return
    }

    const [misRes, yaOfrecidos] = await Promise.all([
      productosApi.getByUsuarioId(auth.user.id),
      obtenerIdsYaOfrecidos()
    ])
    console.log('mis articulos:', misRes.data)

    idsYaOfrecidos.value = yaOfrecidos
    /*misArticulosOferta.value = (misRes.data || [])
      .filter(a => a.disponible !== false)
      .filter(a => !yaOfrecidos.has(a.id))*/
    const filtrados = (misRes.data || [])
      .filter(a => a.disponible !== false)
      .filter(a => !yaOfrecidos.has(a.id))

    misArticulosOferta.value = await Promise.all(filtrados.map(async art => {
      try {
        const fRes = await productosApi.getFotosByArticulo(art.id)
        return { ...art, url: fRes?.data?.[0]?.url || '' }
      } catch {
        return { ...art, url: '' }
      }
    }))



  } catch (e) {
    console.error('Error cargando tus artículos:', e)
    errorOferta.value = 'No se pudieron cargar tus artículos.'
  } finally {
    cargandoOferta.value = false
  }
}

/* PARCHE TEMPORAL: el backend, cuando no existe transacción para un chatId,
// responde 200 con un objeto "default" (GUID en ceros, fecha 0001-01-01) en
// vez de 404. Esto detecta ese caso para no confundirlo con una transacción real.
// TODO: quitar este parche cuando el backend entregue el verificador nuevo
// (Ofeck dijo que no hay que usar getByChatId para esto, va a dar un endpoint
// propio de "existe" — reemplazar aquí en cuanto esté listo).
function esTransaccionVacia(data) {
  if (!data) return true
  const GUID_VACIO = '00000000-0000-0000-0000-000000000000'
  return data.id === GUID_VACIO || data.chatId === GUID_VACIO
}

async function asegurarTransaccion() {
  if (!chatActivo.value?.chatId) {
    throw new Error('chatId inválido: no se puede asegurar la transacción sin un chatId real.')
  }

  let existe = false
  try {
    const res = await transaccionesApi.getByChatId(chatActivo.value.chatId)
    existe = !esTransaccionVacia(res.data)
    //console.log('[asegurarTransaccion] chatId:', chatActivo.value.chatId, '| existe:', existe, '| data:', res.data)
  } catch (e) {
    existe = false
    console.warn('[asegurarTransaccion] error al consultar getByChatId:', e.response?.status, e.response?.data)
  }

  if (!existe) {
    const artRes = await productosApi.getById(chatActivo.value.articuloId)
    //console.log('[asegurarTransaccion] creando transacción -> chatId:', chatActivo.value.chatId, '| esTrueque:', artRes.data?.esTrueque)
    await transaccionesApi.create(chatActivo.value.chatId, Boolean(artRes.data?.esTrueque))
  }
}*/

const enviarArticuloAlChat = async (articulo) => {
  if (enviandoOferta.value || idsYaOfrecidos.value.has(articulo.id)) return;

  enviandoOferta.value = articulo.id;
  errorOferta.value = '';

  try {
    const chatId = await resolverChatIdReal(chatActivo.value)
    console.log('[enviarArticuloAlChat] chatId resuelto:', chatId)
    if (!chatId) {
      errorOferta.value = 'No se pudo determinar el chat de esta conversación todavía. Intenta de nuevo en unos segundos.'
      return
    }
    console.log('[enviarArticuloAlChat] payload a enviar -> chatId:', chatActivo.value.chatId, '| articuloId:', articulo.id, '| articulo completo:', articulo)

    //await asegurarTransaccion();
    await transaccionesApi.addDetalle(chatActivo.value.chatId, articulo.id);

    await sendbirdApi.sendMessage(
      chatActivo.value.channelUrl,
      auth.user.id,
      `Ofrecí: ${articulo.nombre}`,
      {
        customType: 'oferta_articulo',
        data: {
          articuloId: articulo.id,
          nombre: articulo.nombre,
          url: articulo.url || ''
        }
      }
    );

    idsYaOfrecidos.value = new Set(idsYaOfrecidos.value).add(articulo.id);
    misArticulosOferta.value = misArticulosOferta.value.filter(a => a.id !== articulo.id);
    await cargarMensajes(chatActivo.value.channelUrl);
    mostrarSelectorArticulo.value = false;

  } catch (e) {
    console.error('Error ofreciendo el artículo:', e);
    errorOferta.value = 'No se pudo ofrecer el artículo. Intenta de nuevo.';
  } finally {
    enviandoOferta.value = null;
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  height: calc(100vh - 84px);
  background-color: #f9f9f9;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  flex-shrink: 0;
  background: white;
  border-right: 2px solid #e8ddd0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px 16px 12px;
  border-bottom: 1.5px solid #e8ddd0;
}

.sidebar-header h2 {
  font-size: 1.2rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.archivados-section {
  border-top: 2px solid #e8ddd0;
  flex-shrink: 0;
}

.archivados-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #594542;
  cursor: pointer;
}
.archivados-toggle:hover { background-color: #fafafa; }

.archivados-caret {
  transition: transform 0.15s;
}
.archivados-caret.open { transform: rotate(180deg); }

.archivados-section .chat-list {
  flex: none;
  max-height: 260px;
}

.sidebar-empty {
  padding: 24px 16px;
  font-size: 0.85rem;
  color: #aaa;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.sidebar-error { color: #d92100; }

.btn-reintentar {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-reintentar:hover { background-color: #d92100; }

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #ccc;
}

.panel-empty p { font-size: 0.95rem; color: #bbb; margin: 0; }

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 2px solid #e8ddd0;
  background: white;
  gap: 12px;
}

.panel-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-img-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #e8ddd0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.panel-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-img-placeholder { color: #bbb; }

.panel-articulo-nombre {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.panel-vendedor-nombre {
  font-size: 0.78rem;
  color: #888;
  margin: 0;
}

.panel-header-actions { display: flex; gap: 10px; }

.btn-finalizar {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-finalizar:hover:not(:disabled) { background-color: #d92100; }
.btn-finalizar:disabled { opacity: 0.5; cursor: not-allowed; }

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fafafa;
}

.messages-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 0.9rem;
}

.messages-empty strong { color: #888; }

.msg-bubble {
  max-width: 68%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.msg-bubble p {
  margin: 0;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.msg-hora {
  font-size: 0.68rem;
  color: #bbb;
}

.msg-mio {
  align-self: flex-end;
  align-items: flex-end;
}

.msg-mio p {
  background-color: #FA2700;
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-otro {
  align-self: flex-start;
  align-items: flex-start;
}

.msg-otro p {
  background-color: white;
  color: #1a1a1a;
  border: 1.5px solid #e8ddd0;
  border-bottom-left-radius: 4px;
}

/* Tarjeta de oferta: mismo lenguaje visual que ProductCard.vue (borde grueso,
   esquinas bien redondeadas, imagen arriba) pero en tamaño compacto para el
   chat. Ahora es clicable y lleva al detalle completo del artículo. */
.oferta-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  border: 3px solid var(--brand-brown, #FA2700);
  border-radius: 18px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.oferta-card:hover,
.oferta-card:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  outline: none;
}
.oferta-card:active { transform: translateY(0); }

.oferta-card-thumb {
  width: 100%;
  height: 110px;
  object-fit: cover;
  background: #e8ddd0;
  display: block;
}
.oferta-card-thumb.placeholder { background: #e8ddd0; }

.oferta-card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 10px;
  text-align: center;
  background: var(--brand-cream, #fdf6ec);
}

.oferta-card-label {
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #FA2700;
}

.oferta-card-nombre {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-top: 2px solid #e8ddd0;
  background: white;
}

.attach-wrap { position: relative; }

.btn-attach,
.btn-emoji {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.btn-attach:hover:not(:disabled),
.btn-emoji:hover { color: #FA2700; }
.btn-attach:disabled { opacity: 0.4; cursor: not-allowed; }

.attach-popover {
  position: fixed;
  inset: 0;
  z-index: 900;
}

.attach-panel {
  position: absolute;
  bottom: 62px;
  left: 16px;
  width: 260px;
  max-height: 320px;
  overflow-y: auto;
  background: white;
  border: 1.5px solid #e8ddd0;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  padding: 12px;
}

.attach-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 10px;
}

.attach-estado {
  font-size: 0.8rem;
  color: #aaa;
  text-align: center;
  padding: 16px 4px;
}
.attach-error { color: #d92100; }

.attach-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attach-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #e8ddd0;
  background: white;
  border-radius: 10px;
  padding: 6px 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background-color 0.15s;
}
.attach-item:hover:not(:disabled) { border-color: #FA2700; background-color: #fff6f4; }
.attach-item:disabled { opacity: 0.6; cursor: default; }

.attach-thumb {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #e8ddd0;
}
.attach-thumb.placeholder { background: #e8ddd0; }

.attach-nombre {
  flex: 1;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attach-enviando {
  font-size: 0.7rem;
  color: #FA2700;
  font-weight: 700;
  flex-shrink: 0;
}

.msg-input {
  flex: 1;
  border: 1.5px solid #e8ddd0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 0.9rem;
  outline: none;
  background: #fafafa;
  transition: border-color 0.15s;
}

.msg-input:focus { border-color: #FA2700; background: white; }

.btn-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FA2700;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) { background-color: #d92100; }
.btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 700px) {
  .chat-sidebar { width: 100%; }
  .chat-panel { display: none; }
  .chat-page.panel-open .chat-sidebar { display: none; }
  .chat-page.panel-open .chat-panel { display: flex; }
}
  .pago-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 0.85rem;
    font-weight: 700;
  }
 
  .pago-exitoso {
    background-color: #e6f7ec;
    color: #1a7a3d;
    border-bottom: 2px solid #b3e6c5;
  }
 
  .pago-cancelado {
    background-color: #fdecea;
    color: #b3261e;
    border-bottom: 2px solid #f5b8b3;
  }
 
  .pago-banner-close {
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
 }
 .pago-banner-close:hover { opacity: 1; }
</style>