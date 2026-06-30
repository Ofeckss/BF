const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID
const API_TOKEN = import.meta.env.VITE_SENDBIRD_API_TOKEN
const BASE = `https://api-${APP_ID}.sendbird.com/v3`

const headers = {
  'Content-Type': 'application/json',
  'Api-Token': API_TOKEN
}

const cleanId = (id) => String(id).replace('@', '_at_').replace(/\./g, '_')

export async function upsertUser(userId, nickname) {
  const id = cleanId(userId)

  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_id: id,
      nickname: nickname || 'Usuario',
      profile_url: ''
    })
  })

  // 400202 = usuario ya existe, no es un error real, ignorar
  if (!res.ok) {
    const data = await res.json()
    if (data.code === 400202) return // ya existe, está bien
    
    // Otro error, intentar actualizar
    await fetch(`${BASE}/users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nickname: nickname || 'Usuario' })
    })
  }
}

export async function createArticuloChannel({ articuloId, buyerId, sellerId, articuloNombre, imagenUrl }) {
  const cleanBuyerId = cleanId(buyerId)
  const channelUrl = `bartify_art_${articuloId}_buyer_${cleanBuyerId}`

  await fetch(`${BASE}/group_channels`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      channel_url: channelUrl,
      name: articuloNombre,
      cover_url: imagenUrl || '',
      user_ids: [cleanBuyerId, String(sellerId)],
      is_distinct: false
    })
  })

  return channelUrl
}

export async function getUserChannels(userId) {
  const id = cleanId(userId)
  const res = await fetch(
    `${BASE}/users/${id}/my_group_channels?order=latest_last_message&limit=50`,
    { headers }
  )
  const data = await res.json()
  return data.channels || []
}

export async function getMessages(channelUrl) {
  const res = await fetch(
    `${BASE}/group_channels/${channelUrl}/messages?message_ts=99999999999999&prev_limit=50`,
    { headers }
  )
  const data = await res.json()
  return data.messages || []
}

export async function sendMessage(channelUrl, userId, message) {
  const id = cleanId(userId)
  const res = await fetch(`${BASE}/group_channels/${channelUrl}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message_type: 'MESG',
      user_id: id,
      message
    })
  })
  return await res.json()
}