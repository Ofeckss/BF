<template>
  <div class="chat-page">

    <!-- Sidebar: lista de chats -->
    <aside class="chat-sidebar">
      <div class="sidebar-header">
        <h2>Mensajes</h2>
      </div>

      <div v-if="chats.length === 0" class="sidebar-empty">
        No tienes conversaciones aún.
      </div>

      <div class="chat-list">
        <ChatCard
          v-for="chat in chats"
          :key="chat.id"
          :articuloNombre="chat.articuloNombre"
          :vendedorNombre="chat.vendedorNombre"
          :imagen="chat.imagen"
          :ultimoMensaje="chat.ultimoMensaje"
          :hora="chat.hora"
          :unread="chat.unread"
          :isActive="chatActivo?.id === chat.id"
          @select="abrirChat(chat)"
        />
      </div>
    </aside>

    <!-- Panel: mensajes -->
    <main class="chat-panel">

      <!-- Sin chat seleccionado -->
      <div v-if="!chatActivo" class="panel-empty">
        <svg viewBox="0 0 24 24" fill="none" width="56" height="56">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
        </svg>
        <p>Selecciona una conversación para empezar</p>
      </div>

      <!-- Chat activo -->
      <template v-else>
        <!-- Header del chat -->
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
            <button class="btn-finalizar">Finalizar trato</button>
          </div>
        </div>

        <!-- Mensajes -->
        <div class="messages-area" ref="messagesRef">
          <div v-if="mensajes.length === 0" class="messages-empty">
            <p>Inicia la conversación sobre <strong>{{ chatActivo.articuloNombre }}</strong></p>
          </div>
          <div
            v-for="msg in mensajes"
            :key="msg.id"
            :class="['msg-bubble', msg.esMio ? 'msg-mio' : 'msg-otro']"
          >
            <p>{{ msg.texto }}</p>
            <span class="msg-hora">{{ msg.hora }}</span>
          </div>
        </div>

        <!-- Input -->
        <div class="input-area">
          <button class="btn-attach" title="Adjuntar">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" fill="currentColor"/>
            </svg>
          </button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ChatCard from '../components/ChatCard.vue'

const route = useRoute()
const auth = useAuthStore()

const chats = ref([])
const chatActivo = ref(null)
const mensajes = ref([])
const nuevoMensaje = ref('')
const messagesRef = ref(null)

onMounted(() => {
  // Si viene desde ArticuloView con query params, abrir ese chat directamente
  const { articuloId, articuloNombre, articuloImg, vendedorNombre, vendedorId } = route.query

  if (articuloId) {
    // Buscar si ya existe un chat con este artículo
    const existente = chats.value.find(c => c.articuloId === articuloId)
    if (existente) {
      abrirChat(existente)
    } else {
      // Crear nueva entrada en la lista
      const nuevo = {
        id: `chat-${articuloId}`,
        articuloId,
        articuloNombre: articuloNombre || 'Artículo',
        vendedorNombre: vendedorNombre || '',
        vendedorId: vendedorId || '',
        imagen: articuloImg || '',
        ultimoMensaje: '',
        hora: '',
        unread: 0
      }
      chats.value.unshift(nuevo)
      abrirChat(nuevo)
    }
  }
})

const abrirChat = (chat) => {
  chatActivo.value = chat
  // TODO: cargar mensajes reales de Sendbird por chat.id
  mensajes.value = []
}

const enviarMensaje = async () => {
  const texto = nuevoMensaje.value.trim()
  if (!texto || !chatActivo.value) return

  // TODO: enviar por Sendbird
  const msg = {
    id: Date.now(),
    texto,
    esMio: true,
    hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }
  mensajes.value.push(msg)

  // Actualizar último mensaje en la card
  chatActivo.value.ultimoMensaje = texto
  chatActivo.value.hora = msg.hora

  nuevoMensaje.value = ''
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
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

/* Sidebar */
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

.sidebar-empty {
  padding: 24px 16px;
  font-size: 0.85rem;
  color: #aaa;
  text-align: center;
}

/* Panel */
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

/* Header del panel */
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

.btn-finalizar:hover { background-color: #d92100; }

/* Mensajes */
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

/* Input */
.input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-top: 2px solid #e8ddd0;
  background: white;
}

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

.btn-attach:hover,
.btn-emoji:hover { color: #FA2700; }

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
</style>
