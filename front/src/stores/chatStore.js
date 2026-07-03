import { defineStore } from 'pinia'
import { ref } from 'vue'
import chatApi from '@/services/chatApi'
import * as sendbirdApi from '@/services/sendbirdApi'

export const useChatStore = defineStore('chat', () => {
  const channels = ref([])
  const activeChannelUrl = ref(null)
  const activeChannel = ref(null)
  const loading = ref(false)
  const loadError = ref('')

  const espera = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Carga todos los chats del usuario desde el backend.
  // Reintenta una vez si falla (típico cuando Railway "despierta" el backend
  // y la primera petición se corta a medias).
  async function loadChannels() {
    loading.value = true
    loadError.value = ''
    try {
      let res
      try {
        res = await chatApi.getAll()
      } catch (primerError) {
        console.warn('Fallo la primera carga de chats, reintentando...', primerError)
        await espera(1500)
        res = await chatApi.getAll()
      }

      channels.value = res.data.map(ch => ({
        id: ch.url,
        chatId: ch.id, // GUID real del chat en BD, usado por /api/transacciones/*
        channelUrl: ch.url,
        articuloId: ch.articuloPrincipal,
        articuloNombre: ch.nombreArticulo,
        imagen: ch.urlArticulo,
        vendedorNombre: '', // el backend no lo manda, se puede agregar después si se necesita
        ultimoMensaje: '',
        hora: '',
        unread: 0
      }))
    } catch (err) {
      console.error('No se pudieron cargar los chats:', err)
      loadError.value = 'No se pudieron cargar tus conversaciones. Intenta de nuevo.'
      channels.value = []
    } finally {
      loading.value = false
    }
  }

  // Crea (o recupera) el chat para un artículo via backend
  async function openChannelForArticulo({ articuloId, vendedorId, articuloNombre, imagenUrl, sellerNickname }) {
    const res = await chatApi.create(articuloId, vendedorId, articuloNombre)
    const channelUrl = res.data.url // el backend regresa { url, mensaje }, url = sendbird channel url

    activeChannelUrl.value = channelUrl
    // OJO: el endpoint de creación no regresa el chatId (GUID) del chat recién creado,
    // solo el url de sendbird. Por eso ChatView vuelve a llamar loadChannels() al montar,
    // que sí trae el chatId real desde GET /api/chats. Hasta que eso pase, "Finalizar trato"
    // debe quedar deshabilitado para chats nuevos que aún no tienen chatId.
    activeChannel.value = { articuloNombre, imagen: imagenUrl, vendedorNombre: sellerNickname, articuloId, chatId: null }
    return channelUrl
  }

  function setActiveChannel(ch) {
    activeChannelUrl.value = ch.channelUrl
    activeChannel.value = ch
  }

  return {
    channels,
    activeChannelUrl,
    activeChannel,
    loading,
    loadError,
    loadChannels,
    openChannelForArticulo,
    setActiveChannel
  }
})