import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as sendbirdApi from '@/services/sendbirdApi'

const cleanId = (id) => String(id).replace('@', '_at_').replace(/\./g, '_')

export const useChatStore = defineStore('chat', () => {
  const channels = ref([])
  const activeChannelUrl = ref(null)
  const activeChannel = ref(null)

  async function initUser(userId, nickname) {
    await sendbirdApi.upsertUser(userId, nickname)
  }

  async function loadChannels(userId) {
    const raw = await sendbirdApi.getUserChannels(userId)
    channels.value = raw.map(ch => ({
      id: ch.channel_url,
      channelUrl: ch.channel_url,
      articuloNombre: ch.name,
      imagen: ch.cover_url,
      vendedorNombre: ch.members?.find(m => m.user_id !== cleanId(userId))?.nickname || '',
      ultimoMensaje: ch.last_message?.message || '',
      hora: ch.last_message
        ? new Date(ch.last_message.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : '',
      unread: ch.unread_message_count || 0
    }))
  }

  async function openChannelForArticulo({ articuloId, articuloNombre, imagenUrl, buyerId, buyerNickname, sellerId, sellerNickname }) {
    await sendbirdApi.upsertUser(buyerId, buyerNickname)
    await sendbirdApi.upsertUser(sellerId, sellerNickname)

    const channelUrl = await sendbirdApi.createArticuloChannel({
      articuloId,
      buyerId,
      sellerId,
      articuloNombre,
      imagenUrl
    })

    activeChannelUrl.value = channelUrl
    activeChannel.value = { articuloNombre, imagen: imagenUrl, vendedorNombre: sellerNickname }
    return channelUrl
  }

  function setActiveChannel(ch) {
    activeChannelUrl.value = ch.channelUrl
    activeChannel.value = ch
  }

  return { channels, activeChannelUrl, activeChannel, initUser, loadChannels, openChannelForArticulo, setActiveChannel }
})