import { defineStore } from 'pinia'
import { ref } from 'vue'
import chatApi from '@/services/chatApi'
import * as sendbirdApi from '@/services/sendbirdApi'

export const useChatStore = defineStore('chat', () => {
  const channels = ref([])
  const activeChannelUrl = ref(null)
  const activeChannel = ref(null)

  // Carga todos los chats del usuario desde el backend
  async function loadChannels() {
    const res = await chatApi.getAll()
    channels.value = res.data.map(ch => ({
      id: ch.url,
      channelUrl: ch.url,
      articuloId: ch.articuloPrincipal,
      articuloNombre: ch.nombreArticulo,
      imagen: ch.urlArticulo,
      vendedorNombre: '', // el backend no lo manda, se puede agregar después si se necesita
      ultimoMensaje: '',
      hora: '',
      unread: 0
    }))
  }

  // Crea (o recupera) el chat para un artículo via backend
  async function openChannelForArticulo({ articuloId, vendedorId, articuloNombre, imagenUrl, sellerNickname }) {
    const res = await chatApi.create(articuloId, vendedorId, articuloNombre)
    const channelUrl = res.data.url // el backend regresa { url, mensaje }

    activeChannelUrl.value = channelUrl
    activeChannel.value = { articuloNombre, imagen: imagenUrl, vendedorNombre: sellerNickname }
    return channelUrl
  }

  function setActiveChannel(ch) {
    activeChannelUrl.value = ch.channelUrl
    activeChannel.value = ch
  }

  return { channels, activeChannelUrl, activeChannel, loadChannels, openChannelForArticulo, setActiveChannel }
})