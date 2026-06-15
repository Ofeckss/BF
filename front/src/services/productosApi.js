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

  getFotosByArticulo(articuloId) {
    return conectarApi.get(`/Fotos/articulo/${articuloId}`)
  },
  createFoto(foto) {
    return conectarApi.post('/Fotos', foto)
  },

  getCategorias() {
    return conectarApi.get('/categorias')
  }
}