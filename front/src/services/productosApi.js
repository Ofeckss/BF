import conectarApi from './api'

export default {
  getAll() {
    return conectarApi.get('/articulo')
  },
  getById(id) {
    return conectarApi.get(`/articulo/${id}`)
  },
  create(articulo) {
    return conectarApi.post('/articulo', articulo)
  },

  /*getFotosByArticulo(articuloId) {
    return conectarApi.get(`/Fotos/articulo/${articuloId}`)
  },*/
  getCategorias() {
    return conectarApi.get('/categorias')
  }
}