import { defineStore } from 'pinia';
import usuariosApi from '../services/usuariosApi';

export const useUsuariosStore = defineStore('user', {
    state: () => ({
        users: [],
        error: ''
    }),
    actions: {
        async fetchUsuarios() {
            try {
                const res = await usuariosApi.getAll();
                this.users = res.data;
            } catch (error) {
                this.error = error.message;
                console.log(this.error)
            } finally {
            }
        },
        async crearUsuario(nuevoUsuario) {
            try {
                const res = await usuariosApi.create(nuevoUsuario);
                return res.data;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        }
    }
});