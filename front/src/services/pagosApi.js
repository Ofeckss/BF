import conectarApi from './api'

export default {
<<<<<<< HEAD
  // El backend actual (PagosController) solo usa chatId,
  // toma el PrecioFinal que ya debe estar guardado en la transacción.
  crearCheckout(chatId) {
    return conectarApi.post('/api/pagos/checkout', { chatId })
=======
  crearCheckout(chatId, monto) {
    return conectarApi.post('/api/pagos/checkout', { chatId, monto })
>>>>>>> ae308583d0626523c5af56f70249d379eeda3449
  }
}