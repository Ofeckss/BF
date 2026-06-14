import conectarApi from './api'

export default {
  getAll() {
    return conectarApi.get('/Articulos')
  },
  getById(id) {
    return conectarApi.get(`/Articulos/${id}`)
  },
  create(articulo) {
    return conectarApi.post('/Articulos', articulo)
  },

  getFotosByArticulo(articuloId) {
    return conectarApi.get(`/Fotos/articulo/${articuloId}`)
  },
  createFoto(foto) {
    return conectarApi.post('/Fotos', foto)
  },

  getCategorias() {
    return conectarApi.get('/Categorias')
  }
}