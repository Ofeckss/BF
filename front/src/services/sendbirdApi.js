const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID
const API_TOKEN = import.meta.env.VITE_SENDBIRD_API_TOKEN
const BASE = `https://api-${APP_ID}.sendbird.com/v3`

const headers = {
  'Content-Type': 'application/json',
  'Api-Token': API_TOKEN
}

export async function getMessages(channelUrl) {
  const res = await fetch(
    `${BASE}/group_channels/${channelUrl}/messages?message_ts=99999999999999&prev_limit=50`,
    { headers }
  )
  const data = await res.json()
  return data.messages || []
}

export async function sendMessage(channelUrl, userId, message, opts = {}) {
  const body = {
    message_type: 'MESG',
    user_id: String(userId),
    message
  }
  // opts.customType + opts.data permiten mandar mensajes "estructurados"
  // (ej. ofertas de artículo) que el front puede reconocer y pintar como
  // card en vez de burbuja de texto plano.
  if (opts.customType) body.custom_type = opts.customType
  if (opts.data) body.data = JSON.stringify(opts.data)

  const res = await fetch(`${BASE}/group_channels/${channelUrl}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  return await res.json()
}