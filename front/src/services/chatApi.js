import conectarApi from './api'

export default {
  create(articuloId, vendedorId, nombreArticulo) {
    return conectarApi.post('/api/chats', {
      Articulo: articuloId,
      Vendedor: vendedorId,
      Nombre: nombreArticulo
    })
  },


  getAll() {
    return conectarApi.get('/api/chats')
  }
}