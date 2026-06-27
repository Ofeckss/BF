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
  },
  getSubCategoria(id){
    return conectarApi.get(`/api/categorias/${id}`)
  },
  getFotosByArticulo(articuloId){
    return conectarApi.get(`/api/fotos/${articuloId}`)
  },
  createFoto(files, articuloId){
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    formData.append('/articuloId', articuloId)
    return conectarApi.post('/api/fotos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getEstados() {
    return conectarApi.get('/api/estados')
  },
  getUbicaciones() {
    return conectarApi.get('/api/ubicaciones')
  }
}