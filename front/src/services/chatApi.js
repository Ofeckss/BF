import conectarApi from './api'

export default {
  create(articuloId, vendedorId, nombreArticulo, esTrueque) {
    return conectarApi.post('/api/chats', {
      Articulo: articuloId,
      Vendedor: vendedorId,
      Nombre: nombreArticulo,
      EsTrueque: Boolean(esTrueque)
    })
  },


  getAll() {
    return conectarApi.get('/api/chats')
  }
}