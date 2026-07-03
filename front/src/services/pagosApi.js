import conectarApi from './api'

export default {
  // El backend actual (PagosController) solo usa chatId,
  // toma el PrecioFinal que ya debe estar guardado en la transacción.
  crearCheckout(chatId) {
    return conectarApi.post('/api/pagos/checkout', { chatId })
  }
}