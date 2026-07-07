import conectarApi from './api'

export default {
  crearCheckout(chatId, monto) {
    return conectarApi.post('/api/pagos/checkout', { chatId, monto })
  }
}