import axios from "axios";
import conectarApi from "./api";

export default {
    getAll() {
        return conectarApi.get('/usuarios')
    },
    create(nuevoUsuario){
        return crearUsuarioApi.post('/auth/register', nuevoUsuario)
    }
}