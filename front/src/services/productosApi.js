import conectarApi from './api'

export default {
  getAll() {
    return conectarApi.get('/api/articulos')
  },
  getById(id) {
    return conectarApi.get(`/api/articulos/${id}`)
  },
  create(articulo) {
    return conectarApi.post('/api/articulos', articulo)
  },
  getByUsuarioId(id){
    return conectarApi.get(`/api/articulos/usuario/${id}`)
  },
  getCategorias() {
    return conectarApi.get('/api/categorias')
  }
}