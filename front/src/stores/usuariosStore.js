import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import usuariosApi from '../services/UsuariosApi';

export const usuariosStore = defineStore('user', {
    state: () => ({
        users: [],
        error: ''
    }),
    actions: {
        async fetchUsuarios() {
            try{
                const res = await usuariosApi.getAll();
                this.users = res.data;
            } catch (error) {
                this.error = error.message;
                console.log(this.error)
            } finally {
                console.log(this.users)
                console.log('Petición exitosa')
            }
        },
        async crearUsuario(nuevoUsuario){
            try {
                const res = await usuariosApi.create(nuevoUsuario);
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        }
    }
})
