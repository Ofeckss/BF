import conectarApi from "./api";

export default {
    getAll() {
        return conectarApi.get('/Usuarios')
    },
    create(nuevoUsuario) {
        return conectarApi.post('/auth/register', nuevoUsuario)
    }
}