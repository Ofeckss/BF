import conectarApi from './api'

// Coincide 1:1 con Ofeck.Bartify.APIEndpoints.Controllers.UsuarioController
export default {
  getById(id) {
    return conectarApi.get(`/api/usuarios/${id}`)
  },
  updateUsuario(id, payload) {
    return conectarApi.patch(`/api/usuarios/${id}/update`, payload)
  },
  deleteUsuario(id) {
    return conectarApi.delete(`/api/usuarios/${id}/delete`)
  },

  // POST /api/usuarios/{id}/rate?rating={valor}
  // OJO: el controller define `Rate(Guid id, double rating)` sin [FromBody],
  // así que "rating" se manda por query string (comportamiento default de
  // ASP.NET Core para tipos simples), NO en el body. No mandar body aquí.
  rate(id, rating) {
    return conectarApi.post(`/api/usuarios/${id}/rate`, null, {
      params: { rating }
    })
  }
}