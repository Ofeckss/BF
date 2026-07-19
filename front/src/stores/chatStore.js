import { defineStore } from 'pinia'
import { ref } from 'vue'
import chatApi from '@/services/chatApi'
import * as sendbirdApi from '@/services/sendbirdApi'
import productosApi from '@/services/productosApi'

export const useChatStore = defineStore('chat', () => {
  const channels = ref([])
  const activeChannelUrl = ref(null)
  const activeChannel = ref(null)
  const loading = ref(false)
  const loadError = ref('')

  const espera = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  async function loadChannels(usuarioId) {
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

      const base = res.data.map(ch => ({
        id: ch.url,
        chatId: ch.id,
        channelUrl: ch.url,
        articuloId: ch.articuloPrincipal,
        articuloNombre: ch.nombreArticulo,
        imagen: ch.urlArticulo,
        vendedorNombre: '',
        ultimoMensaje: '',
        hora: '',
        unread: 0
      }))

      channels.value = await Promise.all(base.map(ch => resolverNombreOtro(ch, usuarioId)))
    } catch (err) {
      console.error('No se pudieron cargar los chats:', err)
      loadError.value = 'No se pudieron cargar tus conversaciones. Intenta de nuevo.'
      channels.value = []
    } finally {
      loading.value = false
    }
  }

  const cleanId = (id) => String(id).replace('@', '_at_').replace(/\./g, '_')

  async function resolverNombreOtro(ch, usuarioId) {
    if (!usuarioId || !ch.articuloId) return ch
    try {
      const artRes = await productosApi.getById(ch.articuloId)
      const vendedorId = artRes.data?.vendedorId || artRes.data?.vendedor?.vendedorId
      const esVendedor = String(vendedorId) === String(usuarioId)

      if (!esVendedor) {
        const v = artRes.data?.vendedor
        const nombre = v ? `${v.nombre || ''} ${v.apellido || ''}`.trim() : ''
        return { ...ch, vendedorNombre: nombre || 'Vendedor' }
      }

      const miembros = await sendbirdApi.getMiembros(ch.channelUrl)
      const otro = miembros.find(m => String(m.user_id) !== cleanId(usuarioId))
      return { ...ch, vendedorNombre: otro?.nickname || 'Comprador' }
    } catch (e) {
      console.warn('No se pudo resolver con quien es el chat', ch.channelUrl, e)
      return ch
    }
  }

  async function openChannelForArticulo({ articuloId, vendedorId, articuloNombre, imagenUrl, sellerNickname, esTrueque }) {
    const res = await chatApi.create(articuloId, vendedorId, articuloNombre, esTrueque)
    const channelUrl = res.data.url

    activeChannelUrl.value = channelUrl
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