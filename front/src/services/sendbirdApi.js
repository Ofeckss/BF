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

export async function sendMessage(channelUrl, userId, message) {
  const res = await fetch(`${BASE}/group_channels/${channelUrl}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message_type: 'MESG',
      user_id: String(userId),
      message
    })
  })
  return await res.json()
}