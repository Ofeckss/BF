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

// Trae los miembros (participantes) de un canal de Sendbird.
// Esto existe porque el backend .NET NO guarda el compradorId en ninguna
// tabla (Transaccion, Chat, DetalleTransaccion, etc. solo guardan ChatId /
// vendedorId vía el artículo). El canal de Sendbird sí sabe quiénes están
// en la conversación, así que usamos esto como fuente de verdad para
// resolver "quién es el comprador" sin tocar el backend.
export async function getMiembros(channelUrl) {
  const res = await fetch(`${BASE}/group_channels/${channelUrl}/members`, { headers })
  const data = await res.json()
  return data.members || []
}

// Regresa el user_id del OTRO participante del canal (distinto a miUserId).
// Devuelve null si no se pudo resolver (canal con un solo miembro, error de red, etc.)
export async function getOtroMiembro(channelUrl, miUserId) {
  try {
    const miembros = await getMiembros(channelUrl)
    const otro = miembros.find(m => String(m.user_id) !== String(miUserId))
    return otro ? otro.user_id : null
  } catch (e) {
    console.warn('No se pudo obtener el otro miembro del canal de Sendbird:', e)
    return null
  }
}