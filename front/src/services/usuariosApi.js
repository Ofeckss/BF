import conectarApi from "./api";

export default {
    getAll() {
        return conectarApi.get('/usuarios')
    }
}