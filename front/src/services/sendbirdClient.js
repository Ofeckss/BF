import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'

const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID

export const sb = SendbirdChat.init({
  appId: APP_ID,
  modules: [new GroupChannelModule()],
})

export async function connectSendbird(userId, nickname) {
  await sb.connect(String(userId))
  await sb.updateCurrentUserInfo({ nickname })
}

export function disconnectSendbird() {
  return sb.disconnect()
}