import conectarApi from './api'

// Coincide 1:1 con Ofeck.Bartify.APIEndpoints.Controllers.TransaccionController
export default {
  // POST /api/transacciones -> CreateTransaccionRequest(ChatId, EsTrueque)
  create(chatId, esTrueque) {
    return conectarApi.post('/api/transacciones', {
      ChatId: chatId,
      EsTrueque: esTrueque
    })
  },

  // POST /api/transacciones/detalles -> CreateDetalleRequest(ChatId, ArticuloId)
  // [Authorize] - el backend decide OfrecidoVendedor comparando el usuario del JWT
  // contra el vendedor del articulo principal del chat.
  addDetalle(chatId, articuloId) {
    return conectarApi.post('/api/transacciones/detalles', {
      ChatId: chatId,
      ArticuloId: articuloId
    })
  },

  // POST /api/transacciones/confirmar -> ConfirmarRequest(ChatId, Articulos[], Precio?)
  // [Authorize]. "articulos" = ids de MIS articulos ya agregados a la transaccion
  // (los que yo ofrezco). "precio" solo aplica si el que confirma es el comprador
  // y la transaccion no es trueque puro.
  confirmar(chatId, articulosIds, precio = null) {
    return conectarApi.post('/api/transacciones/confirmar', {
      ChatId: chatId,
      Articulos: articulosIds,
      Precio: precio
    })
  },

  // POST /api/transacciones/cancelar -> [FromBody] Guid chatId (guid "pelón", sin wrapper)
  // [Authorize]
  cancelar(chatId) {
    return conectarApi.post('/api/transacciones/cancelar', JSON.stringify(chatId), {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  // GET /api/transacciones/{chatId} -> GetTransaccionResponse
  // { id, chatId, esTrueque, precioFinal, createdAt, updatedAt, articulosVendedor[], articulosComprador[] }
  getByChatId(chatId) {
    return conectarApi.get(`/api/transacciones/${chatId}`)
  },

  // GET /api/transacciones/detalles/{chatId} -> GetDetalleResponse[]
  // { id, ofrecidoVendedor, articulo: MiniArticuloDTO }
  getDetalles(chatId) {
    return conectarApi.get(`/api/transacciones/detalles/${chatId}`)
  },

  // GET /api/transacciones/usuario -> GetAllTransaccionesResponse[]  [Authorize]
  getMisTransacciones() {
    return conectarApi.get('/api/transacciones/usuario')
  },

  // GET /api/transacciones/status -> bool (true = ambos confirmaron)
  // El backend define [HttpGet("status")] GetStatus([FromBody] Guid chatId).
  // Un GET normal no puede llevar body de forma confiable en todos los
  // navegadores/proxies, pero mandamos Content-Type + body explícito con
  // .request() para intentar cumplir el contrato del backend tal cual está.
  // Si algún proxy/CDN descarta el body en un GET, esto seguirá fallando
  // y la única solución real sería que el backend use [FromQuery].
  getStatus(chatId) {
    return conectarApi.get(`/api/transacciones/status/${chatId}`)
  }
}