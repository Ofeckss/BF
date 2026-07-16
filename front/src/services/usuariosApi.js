import conectarApi from './api'

// Coincide 1:1 con Ofeck.Bartify.APIEndpoints.Controllers.UsuarioController
export default {
  getById(id) {
    return conectarApi.get(`/api/usuarios/${id}`)
  },

  // Usado por usuariosStore.js (fetchUsuarios).
  // OJO: la ruta del incoming original era '/Usuarios' (sin /api, sin el
  // patrón que usa el resto de este controller: getById/update/delete/rate
  // todos van bajo /api/usuarios/...). La cambié a '/api/usuarios' por
  // consistencia, pero esto es una SUPOSICIÓN -- confírmala contra
  // UsuarioController.cs antes de mergear. Si el endpoint real es otro
  // (o no existe todavía en el backend), esto va a tronar en 404.
  getAll() {
    return conectarApi.get('/api/usuarios')
  },

  // Alias de updateUsuario: mismo endpoint, mismo método HTTP.
  // AjustesView.vue llama a `.update()`, así que se dejan los dos nombres
  // para no romper ese caller ni el resto del código que usa `updateUsuario`.
  updateUsuario(id, payload) {
    return conectarApi.patch(`/api/usuarios/${id}/update`, payload)
  },
  update(id, payload) {
    return this.updateUsuario(id, payload)
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